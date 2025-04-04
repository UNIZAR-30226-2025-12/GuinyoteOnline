import { useState, useEffect } from 'react';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        setLoading('loading...');
        setData(null);
        setError(null);

        fetch(url, { signal: abortController.signal })
            .then(response => response.json())
            .then(result => {
                setLoading(false);
                result.content ? setData(result.content) : setData(result);
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                setLoading(false);
                setError('An error occurred. Awkward..');
            });

        return () => abortController.abort();
    }, [url]);

    return { data, loading, error };
}

export default useFetch;