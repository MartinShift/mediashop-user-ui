import React, { useState, useEffect, useCallback } from 'react';
import { getFilteredProducts } from '../services/productService';
import { getCategories, getTopCategories } from '../services/categoryService';
import ProductContainer from './shared/ProductContainer';
import ClientTopBar from './shared/ClientTopBar';
import ClientNavBar from './shared/ClientNavBar';
import Footer from './shared/Footer';
import debounce from 'lodash/debounce';
import ShopProductContainer from './shared/ShopProductContainer';

const ShopList = () => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('category');
    console.log('Category ID:', categoryId);
    const [filters, setFilters] = useState({
        search: '',
        categoryIds: categoryId ? [parseInt(categoryId)] : [],
        ratings: [],
        minPrice: 0,
        maxPrice: 100000,
        mediaTypes: [],
        sorting: 0,
        currentPage: 1,
        pageCount: 12
    });

    const [searchInput, setSearchInput] = useState('');
    const [priceInputs, setPriceInputs] = useState({
        min: filters.minPrice,
        max: filters.maxPrice
    });
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [staticCategories, setStaticCategories] = useState([]);
    const [dynamicCategories, setDynamicCategories] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await fetchProducts();
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);


    const useDebounce = (callback, delay) => {
        const timeoutRef = React.useRef(null);

        const debouncedCallback = React.useCallback((...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        }, [callback, delay]);

        React.useEffect(() => {
            return () => {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        }, []);

        return debouncedCallback;
    };

    const processCategories = (products) => {
        // Get unique categories from products
        const uniqueCategories = products.reduce((acc, product) => {
            const categoryId = product.category.id;
            if (!acc[categoryId] && !staticCategories.find(c => c.id === categoryId)) {
                acc[categoryId] = {
                    id: categoryId,
                    name: product.category.name,
                    count: 1
                };
            } else if (acc[categoryId]) {
                acc[categoryId].count++;
            }
            return acc;
        }, {});

        // Convert to array and sort by count
        return Object.values(uniqueCategories)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Take top 5 non-static categories
    };

    useEffect(() => {
        if (products.length > 0) {
            setDynamicCategories(processCategories(products));
        }
    }, [products, staticCategories]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Get top 5 static categories first
                const topCategories = await getTopCategories();
                setStaticCategories(topCategories.slice(0, 5));

                // Then fetch products and process their categories
                await fetchProducts();
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();

            // Add non-empty search
            if (filters.search) {
                queryParams.append('search', filters.search);
            }

            // Add non-empty arrays
            if (filters.categoryIds.length > 0) {
                filters.categoryIds.forEach(id => queryParams.append('categoryIds', id));
            }
            if (filters.ratings.length > 0) {
                filters.ratings.forEach(r => queryParams.append('ratings', r));
            }
            if (filters.mediaTypes.length > 0) {
                filters.mediaTypes.forEach(type => queryParams.append('mediaTypes', type));
            }

            // Add non-default prices
            if (filters.minPrice !== 0) {
                queryParams.append('minPrice', filters.minPrice);
            }
            if (filters.maxPrice !== 100000) {
                queryParams.append('maxPrice', filters.maxPrice);
            }

            // Add pagination and sorting
            queryParams.append('sorting', filters.sorting);
            queryParams.append('currentPage', filters.currentPage);
            queryParams.append('pageCount', filters.pageCount);

            const result = await getFilteredProducts(queryParams);
            setProducts(result.products);
            setCategories(processCategories(result.products));
            setTotalPages(result.pageCount);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDebouncedSearch = useDebounce((value) => {
        setFilters(prev => ({
            ...prev,
            search: value,
            currentPage: 1
        }));
    }, 600);


    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            currentPage: 1
        }));
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);


    const handleDebouncedPriceChange = useDebounce((min, max) => {
        setFilters(prev => ({
            ...prev,
            minPrice: min,
            maxPrice: max,
            currentPage: 1
        }));
    }, 600);

    const handlePriceInputChange = (key, value) => {
        const newValue = parseInt(value) || 0;
        const newPriceInputs = {
            ...priceInputs,
            [key]: newValue
        };
        setPriceInputs(newPriceInputs);
        handleDebouncedPriceChange(newPriceInputs.min, newPriceInputs.max);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value); // Update local state immediately
        handleDebouncedSearch(value); // Debounce the filter update
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({
            ...prev,
            currentPage: page
        }));
    };

    return (
        <>
            <ClientTopBar />
            <ClientNavBar />
            <div className="container-fluid">
                <div className="row px-xl-5">
                    {/* Sidebar Filters */}
                    <div className="col-lg-3 col-md-4">
                        {/* Price Filter */}
                        <div className="mb-4">
                            <h5 className="section-title position-relative text-uppercase mb-3">
                                <span className="bg-secondary pr-3">Фільтр за ціною</span>
                            </h5>
                            <div className="bg-light p-4">
                                <div className="d-flex justify-content-between">
                                    <div className="w-45">
                                        <label className="mb-2">Мінімальна ціна</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={priceInputs.min}
                                            onChange={(e) => handlePriceInputChange('min', e.target.value)}
                                            min="0"
                                            max={priceInputs.max}
                                        />
                                    </div>
                                    <div className="w-45">
                                        <label className="mb-2">Максимальна ціна</label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={priceInputs.max}
                                            onChange={(e) => handlePriceInputChange('max', e.target.value)}
                                            min={priceInputs.min}
                                            max="100000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Categories */}
                        <div className="mb-4">
                            <h5 className="section-title position-relative text-uppercase mb-3">
                                <span className="bg-secondary pr-3">Категорії</span>
                            </h5>
                            <div className="bg-light p-4">
                                {staticCategories.length > 0 && (
                                    <>
                                        <h6 className="mb-3">Популярні категорії</h6>
                                        {staticCategories.map(category => (
                                            <div key={category.id} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id={`category-${category.id}`}
                                                    checked={filters.categoryIds.includes(category.id)}
                                                    onChange={(e) => handleFilterChange('categoryIds',
                                                        e.target.checked
                                                            ? [...filters.categoryIds, category.id]
                                                            : filters.categoryIds.filter(id => id !== category.id)
                                                    )}
                                                />
                                                <label className="custom-control-label" htmlFor={`category-${category.id}`}>
                                                    {category.name}
                                                </label>
                                                <span className="badge border font-weight-normal">{category.count}</span>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {dynamicCategories.length > 0 && (
                                    <>
                                        <h6 className="mt-4 mb-3">Категорії з результатів</h6>
                                        {dynamicCategories.map(category => (
                                            <div key={category.id} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id={`category-${category.id}`}
                                                    checked={filters.categoryIds.includes(category.id)}
                                                    onChange={(e) => handleFilterChange('categoryIds',
                                                        e.target.checked
                                                            ? [...filters.categoryIds, category.id]
                                                            : filters.categoryIds.filter(id => id !== category.id)
                                                    )}
                                                />
                                                <label className="custom-control-label" htmlFor={`category-${category.id}`}>
                                                    {category.name}
                                                </label>
                                                <span className="badge border font-weight-normal">{category.count}</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Media Types */}
                        <div className="mb-4">
                            <h5 className="section-title position-relative text-uppercase mb-3">
                                <span className="bg-secondary pr-3">Тип медіа</span>
                            </h5>
                            <div className="bg-light p-4">
                                {[
                                    { id: 1, name: 'Зображення' },
                                    { id: 2, name: 'Відео' },
                                    { id: 3, name: 'Аудіо' },
                                    { id: 4, name: 'Документ' }
                                ].map(type => (
                                    <div key={type.id} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id={`mediaType-${type.id}`}
                                            checked={filters.mediaTypes.includes(type.id)}
                                            onChange={(e) => {
                                                const newTypes = e.target.checked
                                                    ? [...filters.mediaTypes, type.id]
                                                    : filters.mediaTypes.filter(id => id !== type.id);
                                                handleFilterChange('mediaTypes', newTypes);
                                            }}
                                        />
                                        <label className="custom-control-label" htmlFor={`mediaType-${type.id}`}>
                                            {type.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ratings */}
                        <div className="mb-4">
                            <h5 className="section-title position-relative text-uppercase mb-3">
                                <span className="bg-secondary pr-3">Рейтинг</span>
                            </h5>
                            <div className="bg-light p-4">
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id={`rating-${rating}`}
                                            checked={filters.ratings.includes(rating)}
                                            onChange={(e) => {
                                                const newRatings = e.target.checked
                                                    ? [...filters.ratings, rating]
                                                    : filters.ratings.filter(r => r !== rating);
                                                handleFilterChange('ratings', newRatings);
                                            }}
                                        />
                                        <label className="custom-control-label" htmlFor={`rating-${rating}`}>
                                            {[...Array(rating)].map((_, i) => (
                                                <small key={i} className="fa fa-star text-primary mr-1"></small>
                                            ))}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="col-lg-9 col-md-8">
                        <div className="row pb-3">
                            <div className="col-12 pb-1">
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Пошук продуктів..."
                                        value={searchInput}
                                        onChange={handleSearchChange}
                                    />
                                    <div className="ml-2">
                                        <select
                                            className="form-control"
                                            value={filters.sorting}
                                            onChange={(e) => handleFilterChange('sorting', parseInt(e.target.value))}
                                        >
                                            <option value={0}>Найпопулярніші</option>
                                            <option value={1}>Найбільше відгуків</option>
                                            <option value={2}>Ціна (за зростанням)</option>
                                            <option value={3}>Ціна (за спаданням)</option>
                                            <option value={4}>Рейтинг (за зростанням)</option>
                                            <option value={5}>Рейтинг (за спаданням)</option>
                                            <option value={6}>Найновіші</option>
                                            <option value={7}>Найстаріші</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="col-12 text-center">
                                    <p>Завантаження...</p>
                                </div>
                            ) : (
                                <>
                                    {products.map(product => (
                                        <ProductContainer key={product.id} product={product} />
                                    ))}
                                </>
                            )}

                            {/* Pagination */}
                            <div className="col-12">
                                <nav>
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${filters.currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(filters.currentPage - 1)}
                                            >
                                                Попередня
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i + 1} className={`page-item ${filters.currentPage === i + 1 ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${filters.currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(filters.currentPage + 1)}
                                            >
                                                Наступна
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ShopList;