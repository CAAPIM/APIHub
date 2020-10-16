import React from 'react';
import { TextInput, SelectInput, required } from 'react-admin';

/**
 * A custom react admin input which takes a Layer7 ApiHub CustomField
 * definition and returns a configured react admin input.
 * @param {Object} props
 * @param {Object.customField} The CustomField definition
 *
 * @example
 * export function TestPage() {
 *     const [formValues, setFormValues] = React.useState();
 *     const { ids, data, loaded } = useGetList('customFields');
 *
 *     if (!loaded) {
 *         return null;
 *     }
 *
 *     const handleSubmit = values => {
 *         setFormValues(values);
 *     };
 *
 *     return (
 *         <>
 *             <SimpleForm save={handleSubmit}>
 *                 {ids.map(id => (
 *                     <CustomFieldInput
 *                         key={id}
 *                         // source is required to properly link the label to the input
 *                         source={data[id].Name}
 *                         customField={data[id]}
 *                     />
 *                 ))}
 *             </SimpleForm>
 *             <p>{formValues ? JSON.stringify(formValues, null, 4) : null}</p>
 *         </>
 *     );
 * }
 */
export function CustomFieldInput(props) {
    const { customField, ...rest } = props;
    if (customField.Type === CustomFieldTypeText) {
        return (
            <TextInput
                {...rest}
                // Required because react-admin forms clone their children and
                // may inject an undefined id if a child has no source prop
                id={customField.Name}
                source={customField.id}
                label={customField.Name}
                validate={customField.Required ? required() : undefined}
            />
        );
    }

    if (customField.Type === CustomFieldTypeSingleSelect) {
        return (
            <SelectInput
                {...rest}
                // Required because react-admin forms clone their children and
                // may inject an undefined id if a child has no source prop
                id={customField.Name}
                source={customField.id}
                label={customField.Name}
                choices={customField.OptionsList.results
                    .sort(sortByOrdinal)
                    .map(choice => ({
                        id: choice.Value,
                        name: choice.Value,
                    }))}
                validate={customField.Required ? required() : undefined}
            />
        );
    }

    return null;
}

const CustomFieldTypeText = 'TEXT';
const CustomFieldTypeSingleSelect = 'SINGLE_SELECT';
const sortByOrdinal = (a, b) => a.Ordinal - b.Ordinal;
