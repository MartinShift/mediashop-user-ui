import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import debounce from 'lodash/debounce';
import { searchCategories, getCategory } from '../../services/categoryService';

const CategorySearchSelect = ({ onCategorySelect, initialCategoryId }) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchInitialCategory = async () => {
      if (!initialCategoryId) return;
      
      setIsLoading(true);
      try {
        const category = await getCategory(initialCategoryId);
        const option = {
          value: category.id,
          label: category.name
        };
        setSelectedOption(option);
        setOptions([option]);
      } catch (error) {
        console.error('Error fetching initial category:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialCategory();
  }, [initialCategoryId]);

  const debouncedSearch = useCallback(
    debounce(async (inputValue) => {
      if (!inputValue) return;
      setIsLoading(true);
      try {
        const categories = await searchCategories(inputValue);
        const formattedOptions = categories.map(cat => ({
          value: cat.id,
          label: cat.name
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error searching categories:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (newValue) => {
    debouncedSearch(newValue);
  };

  const handleChange = (selected) => {
    setSelectedOption(selected);
    onCategorySelect(selected ? selected.value : null);
  };

  return (
    <Select
      value={selectedOption}
      isClearable
      isSearchable
      isLoading={isLoading}
      options={options}
      onInputChange={handleInputChange}
      onChange={handleChange}
      placeholder="Пошук категорії..."
      noOptionsMessage={() => "Немає категорій"}
      loadingMessage={() => "Завантаження..."}
    />
  );
};

export default CategorySearchSelect;