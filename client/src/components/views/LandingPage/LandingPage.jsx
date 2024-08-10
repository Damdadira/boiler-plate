import React, { useEffect } from 'react';
import axios from 'axios';

//ant Design css
import { DatePicker } from 'antd';

function LandingPage() {
    useEffect(() => {
        axios
            .get('/api/hello')
            .then((response) => console.log(response))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            LandingPage
            <DatePicker></DatePicker>
        </div>
    );
}

export default LandingPage;
