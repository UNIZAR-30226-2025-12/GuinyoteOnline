// usePost.js
import { useState } from 'react';

const usePost = (baseURL) => {

    const postData = async (datos, specificURL) => {

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

            return{responseData, error: null}

        } catch (err) {
            return { responseData: null, error: err.message };
        }
    };

    return { postData };
};

export default usePost;
