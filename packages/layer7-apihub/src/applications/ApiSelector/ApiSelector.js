import * as React from 'react';
import {
    Chip,
    FormControl,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    Tabs,
    Tab,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDataProvider, useQuery, useTranslate } from 'ra-core';
import { useForm } from 'react-final-form';
import get from 'lodash/get';

import { ListArrayInput, ReferenceArrayInput } from '../../ui';
import { SelectionList } from './SelectionList';
import { TabPanel } from './TabPanel';
import { ListArrayInputFilter } from './ListArrayInputFilter';
import { ApiChoiceItem } from './ApiChoiceItem';
import { ApiGroupChoiceItem } from './ApiGroupChoiceItem';
import { ApiSelectionModal } from './ApiSelectionModal';
import { ApiGroupSelectionModal } from './ApiGroupSelectionModal';
import { useLayer7Notify } from '../../useLayer7Notify';

export function ApiSelector(props) {
    const { application, resource = '', orgUuid, apis = [] } = props;
    const translate = useTranslate();
    const [selectedTab, setSelectedTab] = React.useState('apis');
    const [selectedItems, setSelectedItems] = React.useState(apis);
    const [selectedApi, setSelectedApi] = React.useState();
    const [selectedApiGroup, setSelectedApiGroup] = React.useState(undefined);
    const [apiPlansEnabled, setApiPlansEnabled] = React.useState(false);
    const [tags, setTags] = React.useState([]);
    const [filterTags, setFilterTags] = React.useState([]);

    const form = useForm();
    const classes = useStyles(props);
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();

    const {
        data: apiPlanFeatureFlag,
        loading: isLoadingApiPlansFeatureFlag,
    } = useQuery({
        type: 'getApiPlansFeatureFlag',
        resource: 'apiPlans',
        payload: {},
    });

    React.useEffect(() => {
        if (apiPlanFeatureFlag) {
            setApiPlansEnabled(apiPlanFeatureFlag.value === 'true');
        }
    }, [apiPlanFeatureFlag]);

    React.useEffect(() => {
        async function fetchTags() {
            const { data } = await dataProvider.getList(
                'tags',
                {},
                {
                    onFailure: error => notify(error),
                }
            );
            setTags(data);
        }
        if (tags.length === 0) {
            fetchTags();
        }
    }, []);

    // This effect preloads the initially selected items (either APIs or Groups)
    // when editing an existing application.
    // It uses the dataProvider directly instead of getMany because getMany
    // to avoid dealing with many loaded/loading states and prevent some rerender issues
    React.useEffect(() => {
        async function fetchInitialSelectedItems() {
            if (application.ApiIds && application.ApiIds.results.length > 0) {
                const { data: selectedApis } = await dataProvider.getMany(
                    'apis',
                    {
                        ids: application.ApiIds.results || [],
                    },
                    {
                        onFailure: error => notify(error),
                    }
                );

                let selectedApiPlans = [];
                if (get(application, 'ApiApiPlanIds.results.length', 0)) {
                    form.change(
                        'ApiApiPlanIds',
                        Array.from(application.ApiApiPlanIds.results)
                    );

                    const { data: apiPlans } = await dataProvider.getMany(
                        'apiPlans',
                        {
                            ids: Array.from(
                                new Set(
                                    application.ApiApiPlanIds.results
                                        .map(result => result.ApiPlanUuid)
                                        .filter(uuid => uuid)
                                )
                            ),
                        },
                        {
                            onFailure: error => notify(error),
                        }
                    );
                    selectedApiPlans = apiPlans;
                }

                setInitialSelectedApis(
                    selectedApis,
                    selectedApiPlans,
                    get(application, 'ApiApiPlanIds.results', [])
                );
            }
            if (
                application.ApiGroupIds &&
                application.ApiGroupIds.results.length > 0
            ) {
                const { data: apiGroups } = await dataProvider.getList(
                    'apiGroups',
                    {
                        filter: {
                            orgUuid: orgUuid,
                            applicationUuid: application.id,
                        },
                        pagination: { page: 1, perPage: 1000 },
                    },
                    {
                        onFailure: error => notify(error),
                    }
                );
                const selectedApiGroups = apiGroups.filter(apiGroup =>
                    application.ApiGroupIds.results.find(
                        id => apiGroup.id === id
                    )
                );
                setInitialSelectedApiGroups(selectedApiGroups);
            }
        }

        if (application) {
            fetchInitialSelectedItems();
        }
    }, [JSON.stringify(application)]); // eslint-disable-line

    React.useEffect(() => {
        setSelectedItems([]);
        setSelectedApi(undefined);
        setSelectedApiGroup(undefined);
        setSelectedTab('apis');
        form.change('ApiIds', undefined);
        form.change('ApiGroupIds', undefined);
    }, [form, orgUuid]);

    const setInitialSelectedApis = (records, apiPlans, results) => {
        const apiIds = records.map(item => item.id);
        form.change('ApiIds', Array.from(apiIds));

        setSelectedItems(previousSelectedItems => {
            const newSelectedItems = new Set(previousSelectedItems);
            records.forEach(record => {
                newSelectedItems.add({
                    type: 'apis',
                    record: {
                        ...record,
                        apiPlan: apiPlans.find(
                            apiPlan =>
                                apiPlan.id ===
                                get(
                                    results.find(
                                        result =>
                                            result.ApiUuid === record.id &&
                                            result.ApiPlanUuid === apiPlan.id
                                    ),
                                    'ApiPlanUuid'
                                )
                        ),
                    },
                });
            });

            return Array.from(newSelectedItems);
        });
    };

    const setInitialSelectedApiGroups = records => {
        const selectedApiGroups = records.map(item => item.id);

        form.change('ApiGroupIds', Array.from(selectedApiGroups));

        setSelectedItems(previousSelectedItems => {
            const newSelectedItems = new Set(previousSelectedItems);
            records.forEach(record => {
                newSelectedItems.add({
                    type: 'apiGroups',
                    record: record,
                });
            });

            return Array.from(newSelectedItems);
        });
    };

    const handleTabChange = (event, newSelectedTab) =>
        setSelectedTab(newSelectedTab);

    const handleApiAdded = (event, record) => {
        // Prevent the ListArrayInput change because we want to display a modal
        // for ApiPlan selection first
        event.preventDefault();
        // Store the selected API which will trigger the modal display
        setSelectedApi(record);
    };

    const handleApiConfirmed = event => {
        // Get the current list of ApiIds
        const selectedApis = new Set(form.getState().values.ApiIds || []);
        selectedApis.add(selectedApi.id);

        // Update the form by adding the selected API
        form.change('ApiIds', Array.from(selectedApis));

        const selectedApiPlans = new Set(
            form.getState().values.ApiApiPlanIds || []
        );
        if (selectedApi.apiPlan) {
            selectedApiPlans.add({
                ApiUuid: selectedApi.id,
                ApiPlanUuid: selectedApi.apiPlan.uuid,
            });
        } else if (apiPlansEnabled) {
            selectedApiPlans.add({
                ApiUuid: selectedApi.id,
                ApiPlanUuid: null,
            });
        }
        form.change('ApiApiPlanIds', Array.from(selectedApiPlans));

        // Update the selection list
        setSelectedItems(previousSelectedItems => {
            const newSelectedItems = new Set(previousSelectedItems);
            newSelectedItems.add({ type: 'apis', record: selectedApi });

            return Array.from(newSelectedItems);
        });

        // Close the modal
        setSelectedApi(undefined);
    };

    const handleApiPlanChanged = (event, api) => {
        const selectedApiPlanIds = (
            form.getState().values.ApiApiPlanIds || []
        ).map(apiPlanId => {
            const newApiPlanId = { ...apiPlanId };
            if (newApiPlanId.ApiUuid === api.id) {
                newApiPlanId.ApiPlanUuid = api.apiPlan.uuid;
            }
            return newApiPlanId;
        });
        form.change('ApiApiPlanIds', selectedApiPlanIds);

        setSelectedItems(previousSelectedItems => {
            const newSelectedItems = previousSelectedItems.map(item => {
                const newRecord = { ...item.record };
                if (newRecord.id === api.id) {
                    newRecord.apiPlan = api.apiPlan;
                }
                return { type: 'apis', record: newRecord };
            });

            return newSelectedItems;
        });
    };

    const handleApiCancelled = event => {
        setSelectedApi(undefined);
    };

    const handleApiGroupAdded = (event, record) => {
        event.preventDefault();
        setSelectedApiGroup(record);
    };

    const handleApiGroupConfirmed = event => {
        // Get the current list of ApiGroupIds
        const selectedApiGroups = new Set(
            form.getState().values.ApiGroupIds || []
        );
        selectedApiGroups.add(selectedApiGroup.id);

        // Update the form by adding the selected API
        form.change('ApiGroupIds', Array.from(selectedApiGroups));

        setSelectedItems(previousSelectedItems => {
            const newSelectedItems = new Set(previousSelectedItems);
            newSelectedItems.add({
                type: 'apiGroups',
                record: selectedApiGroup,
            });

            return Array.from(newSelectedItems);
        });

        // Close the modal
        setSelectedApiGroup(undefined);
    };

    const handleApiGroupCancelled = event => {
        setSelectedApiGroup(undefined);
    };

    const handleItemRemoved = (event, itemToRemove) => {
        setSelectedItems(previousSelectedItems =>
            previousSelectedItems.filter(item => {
                const differentType = itemToRemove.type !== item.type;
                const differentId = itemToRemove.record.id !== item.record.id;

                return differentType || differentId;
            })
        );

        let field = itemToRemove.type === 'apis' ? 'ApiIds' : 'ApiGroupIds';
        // We can't use form.getFieldState here because the tab containing
        // the input for the field may not be active and getFieldState returns
        // undefined in this case.
        const selectedItemIds = form.getState().values[field] || [];
        form.change(
            field,
            selectedItemIds.filter(id => id !== itemToRemove.record.id)
        );

        if (apiPlansEnabled) {
            const selectedApiPlanIds = form.getState().values['ApiApiPlanIds'] || [];
            form.change(
                'ApiApiPlanIds',
                selectedApiPlanIds.filter(object => object.ApiUuid !== itemToRemove.record.id)
            );
        }
    };

    if (isLoadingApiPlansFeatureFlag) {
        return null;
    }

    const TagSelector = props => {
        const handleChange = event => {
            setFilterTags(event.target.value);
        };

        return (
            <>
                <ListArrayInputFilter {...props} alwaysOn />
                <FormControl className={classes.tagFilter}>
                    <InputLabel>
                        {translate(
                            'resources.applications.actions.filterByTag'
                        )}
                    </InputLabel>
                    <Select
                        multiple
                        autoWidth
                        value={filterTags}
                        onChange={handleChange}
                        input={<Input />}
                        renderValue={selected => (
                            <div className={classes.tags}>
                                {selected.map(value => (
                                    <Chip
                                        key={value.uuid}
                                        label={value.name}
                                        className={classes.tag}
                                    />
                                ))}
                            </div>
                        )}
                    >
                        {tags.map(tag => (
                            <MenuItem key={tag.uuid} value={tag}>
                                {tag.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </>
        );
    };

    return (
        <>
            <Grid className={classes.root} container spacing={4}>
                <Grid item xs={5}>
                    <SelectionList
                        selectedItems={selectedItems}
                        onItemRemoved={handleItemRemoved}
                        onApiPlanChanged={handleApiPlanChanged}
                        orgUuid={orgUuid}
                    />
                </Grid>
                <Grid item xs={7}>
                    <Tabs
                        className={classes.tabs}
                        value={selectedTab}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab
                            label={translate('resources.apis.name', {
                                smart_count: 2,
                            })}
                            id="api-selector-tab-apis"
                            aria-controls="api-selector-tabpanel-apis"
                            value="apis"
                        />
                        {!apiPlansEnabled && (
                            <Tab
                                label={translate('resources.apiGroups.name', {
                                    smart_count: 2,
                                })}
                                id="api-selector-tab-api-groups"
                                aria-controls="api-selector-tabpanel-api-groups"
                                value="apiGroups"
                            />
                        )}
                    </Tabs>
                    <TabPanel value={selectedTab} index="apis">
                        {orgUuid && (
                            <ReferenceArrayInput
                                label=""
                                source="ApiIds"
                                reference="apis"
                                resource={resource}
                                perPage={5}
                                filter={{
                                    portalStatus: 'ENABLED',
                                    orgUuid: orgUuid,
                                    tags: filterTags.map(tag => tag.name),
                                }}
                            >
                                <ListArrayInput
                                    filters={<TagSelector />}
                                    onAdd={handleApiAdded}
                                >
                                    <ApiChoiceItem />
                                </ListArrayInput>
                            </ReferenceArrayInput>
                        )}
                    </TabPanel>
                    {!apiPlansEnabled && (
                        <TabPanel value={selectedTab} index="apiGroups">
                            {orgUuid && (
                                <ReferenceArrayInput
                                    label=""
                                    source="ApiGroupIds"
                                    reference="apiGroups"
                                    resource={resource}
                                    perPage={5}
                                    filter={{ orgUuid: orgUuid }}
                                >
                                    <ListArrayInput
                                        filters={<ListArrayInputFilter />}
                                        onAdd={handleApiGroupAdded}
                                    >
                                        <ApiGroupChoiceItem />
                                    </ListArrayInput>
                                </ReferenceArrayInput>
                            )}
                        </TabPanel>
                    )}
                    <ApiSelectionModal
                        api={selectedApi}
                        onConfirm={handleApiConfirmed}
                        onCancel={handleApiCancelled}
                        apiPlansEnabled={apiPlansEnabled}
                        source="ApiApiPlanIds"
                        orgUuid={orgUuid}
                    />
                    <ApiGroupSelectionModal
                        apiGroup={selectedApiGroup}
                        onConfirm={handleApiGroupConfirmed}
                        onCancel={handleApiGroupCancelled}
                        source="ApiGroupIds"
                        orgUuid={orgUuid}
                    />
                </Grid>
            </Grid>
        </>
    );
}

const useStyles = makeStyles(
    theme => ({
        root: {
            marginBottom: theme.spacing(1),
        },
        tabs: {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        tagFilter: {
            marginLeft: theme.spacing(1),
            marginTop: theme.spacing(3),
            minWidth: theme.spacing(20),
            maxWidth: theme.spacing(200),
        },
        tags: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        tag: {
            margin: theme.spacing(1),
        },
    }),
    {
        name: 'Layer7ApiSelector',
    }
);
