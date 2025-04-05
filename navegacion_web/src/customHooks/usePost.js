// usePost.js
import { useEffect, useState } from 'react';

const usePost = (baseURL) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const changeData = (newData) => {
        setData(newData);
    }

    const postData = async (datos, specificURL) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(baseURL + specificURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }
            let responseData = null;
            try {
                responseData = await response.json();
            } catch (parseError) {
                throw new Error('Error parsing JSON response');
            }
            changeData(responseData);
            console.log('Response Data:', responseData); // Log responseData directly/
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, postData };
};

export default usePost;
