import {useState, useEffect} from 'react';
import {QueryCache} from '../cache';

export default function useFetch(url, options = {
    method: 'GET',
}) {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cacheKey = `${url}?${JSON.stringify(options)}`;
                let fetchOptions = {...options};
                switch (options.method) {
                    case 'GET':
                        if (QueryCache.hasCacheValue(cacheKey)) {
                            setResponse(QueryCache.getCacheValue(cacheKey));
                            setLoading(false);
                            return;
                        }
                        break;
                    case 'POST':
                        fetchOptions.headers = options.headers || {
                            'Content-Type': 'application/json',
                        };
                        if(options.body) {
                            fetchOptions.body = JSON.stringify(options.body);
                        }
                        break;
                }
                const response = await fetch(url, fetchOptions);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonResponse = await response.json();
                setResponse(jsonResponse);
                QueryCache.setCacheValue(cacheKey, jsonResponse);
                if (options.method === 'POST') {
                    QueryCache.clearCache();  // Consider revising to avoid clearing the entire cache.
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then(() => {
        });
    }, [url, JSON.stringify(options)]);

    return {response, loading, error};
}

