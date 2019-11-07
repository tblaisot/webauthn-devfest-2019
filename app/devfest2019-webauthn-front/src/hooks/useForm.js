import {useState} from 'react';

export const useForm = (defaultForm, callback) => {

  const [values, setValues] = useState(defaultForm);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    await callback(values);
  };

  const handleChange = (event) => {
    event.persist();
    setValues(values => ({...values, [event.target.name]: event.target.value}));
  };

  return {
    handleChange,
    handleSubmit,
    values
  }
};
