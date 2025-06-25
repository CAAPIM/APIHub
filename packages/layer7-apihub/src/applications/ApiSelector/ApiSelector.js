// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useFormContext } from 'react-hook-form';
import get from 'lodash/get';
import { ListArrayInput } from '../../ui';
import { ReferenceArrayInput } from 'react-admin';
import { SelectionList } from './SelectionList';
import { TabPanel } from './TabPanel';
import { ListArrayInputFilter } from './ListArrayInputFilter';
import { ApiChoiceItem } from './ApiChoiceItem';
import { ApiGroupChoiceItem } from './ApiGroupChoiceItem';
import { ApiSelectionModal } from './ApiSelectionModal';
import { ApiGroupSelectionModal } from './ApiGroupSelectionModal';
import { useLayer7Notify } from '../../useLayer7Notify';
import {
    useDataProvider,
    useGetList,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useMutation } from '@tanstack/react-query';

export function ApiSelector(props) {
    const {
        application,
        orgUuid,
        apiIds = [],
        ApiGroupIds = [],
        ApiApiPlanIds = [],
        apiPlansEnabled,
        isEditApisLocked = false,
        isEditApiGroupsLocked = false,
    } = props;
    const translate = useTranslate();
    const [selectedTab, setSelectedTab] = useState('apis');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedApi, setSelectedApi] = useState();
    const [selectedApiGroup, setSelectedApiGroup] = useState(undefined);
    const [tags, setTags] = useState([]);
    const [filterTags, setFilterTags] = useState([]);
    const form = useFormContext();
    const { classes } = useStyles(props);
    const dataProvider = useDataProvider();
    const notify = useLayer7Notify();
    const resource = useResourceContext();
    const { mutateAsync: fetchManyApisAsync } = useMutation({
        mutationFn: ({ ids }) =>
            dataProvider.getMany('apis', {
                ids,
            }),
        onError: error => notify(error),
    });
    const { mutateAsync: fetchManyApiPlansAsync } = useMutation({
        mutationFn: ({ ids }) =>
            dataProvider.getMany('apiPlans', {
                ids,
            }),
        onError: error => notify(error),
    });
    const { mutateAsync: fetchApiGroupsListAsync } = useMutation({
        mutationFn: ({ filter }) =>
            dataProvider.getList('apiGroups', {
                filter,
                pagination: { page: 1, perPage: 1000 },
            }),
        onError: error => notify(error),
    });

    // This effect preloads the initially selected items (either APIs or Groups)
    // when editing an existing application.
    // It uses the dataProvider directly instead of getMany because getMany
    // to avoid dealing with many loaded/loading states and prevent some rerender issues
    useEffect(() => {
        (async () => {
            if (apiIds && apiIds.length > 0) {
                const { data: selectedApis } = await fetchManyApisAsync({
                    ids: apiIds,
                });

                let selectedApiPlans = [];
                if (ApiApiPlanIds.length) {
                    form.setValue('ApiApiPlanIds', Array.from(ApiApiPlanIds), {
                        shouldDirty: true,
                    });
                    const apiPlansIds = Array.from(
                        new Set(
                            ApiApiPlanIds.map(
                                result => result.ApiPlanUuid
                            ).filter(uuid => uuid)
                        )
                    );
                    const { data: apiPlans } = await fetchManyApiPlansAsync({
                        ids: apiPlansIds,
                    });
                    selectedApiPlans = apiPlans;
                }
                setInitialSelectedApis(
                    selectedApis,
                    selectedApiPlans,
                    ApiApiPlanIds
                );
            }
            if (ApiGroupIds && ApiGroupIds.length > 0) {
                const { data: apiGroups } = await fetchApiGroupsListAsync({
                    filter: {
                        orgUuid,
                        applicationUuid: application.id,
                    },
                });

                const selectedApiGroups = apiGroups.filter(apiGroup =>
                    ApiGroupIds.find(id => apiGroup.id === id)
                );
                setInitialSelectedApiGroups(selectedApiGroups);
            }
        })();
    }, [apiIds, ApiApiPlanIds, ApiGroupIds]);

    const {
        data: tagsData,
        isSuccess: fetchTagsIsSuccess,
        isError: fetchTagsIsError,
        error: fetchTagsError,
    } = useGetList('tags');

    useEffect(() => {
        if (fetchTagsIsSuccess) {
            setTags(tagsData);
        }
        if (fetchTagsIsError) {
            notify(fetchTagsError);
        }
    }, [
        fetchTagsIsSuccess,
        fetchTagsIsError,
        fetchTagsError,
        tagsData,
        notify,
    ]);

    useEffect(() => {
        setSelectedItems([]);
        setSelectedApi(undefined);
        setSelectedApiGroup(undefined);
        setSelectedTab('apis');
        form.setValue('apiIds', undefined);
        form.setValue('ApiGroupIds', undefined);
    }, [orgUuid]);

    const setInitialSelectedApis = (records, apiPlans, results) => {
        const apiIds = records.map(item => item.id);
        form.setValue('apiIds', Array.from(apiIds), { shouldDirty: true });
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

        form.setValue('ApiGroupIds', Array.from(selectedApiGroups), {
            shouldDirty: true,
        });

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
        const selectedApis = new Set(form.getValues('apiIds') || []);
        selectedApis.add(selectedApi.id);

        // Update the form by adding the selected API
        form.setValue('apiIds', Array.from(selectedApis), {
            shouldDirty: true,
        });

        const selectedApiPlans = new Set(form.getValues('ApiApiPlanIds') || []);
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
        form.setValue('ApiApiPlanIds', Array.from(selectedApiPlans), {
            shouldDirty: true,
        });

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
        const selectedApiPlanIds = (form.getValues('ApiApiPlanIds') || []).map(
            apiPlanId => {
                const newApiPlanId = { ...apiPlanId };
                if (newApiPlanId.ApiUuid === api.id) {
                    newApiPlanId.ApiPlanUuid = api.apiPlan.uuid;
                }
                return newApiPlanId;
            }
        );
        form.setValue('ApiApiPlanIds', selectedApiPlanIds, {
            shouldDirty: true,
        });

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
        const selectedApiGroups = new Set(form.getValues('ApiGroupIds') || []);
        selectedApiGroups.add(selectedApiGroup.id);

        // Update the form by adding the selected API
        form.setValue('ApiGroupIds', Array.from(selectedApiGroups), {
            shouldDirty: true,
        });

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

        let field = itemToRemove.type === 'apis' ? 'apiIds' : 'ApiGroupIds';
        // We can't use form.getFieldState here because the tab containing
        // the input for the field may not be active and getFieldState returns
        // undefined in this case.
        const selectedItemIds = form.getValues(field) || [];
        form.setValue(
            field,
            selectedItemIds.filter(id => id !== itemToRemove.record.id),
            { shouldDirty: true }
        );

        if (apiPlansEnabled) {
            const selectedApiPlanIds = form.getValues('ApiApiPlanIds') || [];
            form.setValue(
                'ApiApiPlanIds',
                selectedApiPlanIds.filter(
                    object => object.ApiUuid !== itemToRemove.record.id
                ),
                { shouldDirty: true }
            );
        }
    };

    const Filters = () => {
        const handleChange = event => {
            setFilterTags(event.target.value);
        };

        return (
            <>
                <ListArrayInputFilter />
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
                        isEditApisLocked={isEditApisLocked}
                        isEditApiGroupsLocked={isEditApiGroupsLocked}
                    />
                </Grid>
                <Grid item xs={7}>
                    <Tabs
                        className={classes.tabs}
                        value={selectedTab}
                        onChange={handleTabChange}
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
                                source="apiIds"
                                reference="apis"
                                perPage={5}
                                filter={{
                                    portalStatus: 'ENABLED',
                                    orgUuid: orgUuid,
                                    tags: filterTags.map(tag => tag.name),
                                }}
                            >
                                <ListArrayInput
                                    source="apiIds"
                                    filters={<Filters />}
                                    onAdd={handleApiAdded}
                                >
                                    <ApiChoiceItem
                                        disabled={isEditApisLocked}
                                    />
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
                                        source="ApiGroupIds"
                                        filters={<ListArrayInputFilter />}
                                        onAdd={handleApiGroupAdded}
                                    >
                                        <ApiGroupChoiceItem
                                            disabled={isEditApiGroupsLocked}
                                        />
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

const useStyles = makeStyles({ name: 'Layer7ApiSelector' })(theme => ({
    root: {
        marginBottom: theme.spacing(1),
    },
    tabs: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    tagFilter: {
        marginLeft: theme.spacing(1),
        marginTop: 0,
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
}));
