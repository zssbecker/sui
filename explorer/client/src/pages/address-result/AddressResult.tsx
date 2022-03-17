import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import ErrorResult from '../../components/error-result/ErrorResult';
import Longtext from '../../components/longtext/Longtext';
import theme from '../../styles/theme.module.css';
import { findDataFromID } from '../../utils/utility_functions';
import styles from './AddressResult.module.css';

type DataType = {
    id: string;
    objects: { objectId: string }[];
};

function instanceOfDataType(object: any): object is DataType {
    return object !== undefined && ['id', 'objects'].every((x) => x in object);
}

function SuccessAddress({ data }: { data: DataType }) {
    const [results, setResults] = useState(
        data?.objects.map(({ objectId }) => ({ id: objectId }))
    );

    useEffect(() => {
        Promise.all(
            data.objects.map(({ objectId }: { objectId: string }) => {
                const entry = findDataFromID(objectId, undefined);
                return {
                    id: entry.id,
                    type: entry.objType,
                };
            })
        )
            .then((resp) => setResults(resp))
            .catch((err) => console.log(err));
    }, [data]);

    return (
        <div className={theme.textresults}>
            <div>
                <div>Address ID</div>
                <div>
                    <Longtext
                        text={data?.id}
                        category="addresses"
                        isLink={false}
                    />
                </div>
            </div>
            <div>
                <div>Owned Objects</div>
                <div>
                    {results && results.length > 0 ? (
                        <div>{JSON.stringify(results)}</div>
                    ) : (
                        <div className={styles.noobjects}>
                            This address owns no objects
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function AddressResult() {
    const { state } = useLocation();
    const { id: addressID } = useParams();

    const data = findDataFromID(addressID, state);

    if (instanceOfDataType(data)) {
        return <SuccessAddress data={data} />;
    } else {
        return (
            <ErrorResult
                id={addressID}
                errorMsg="There was an issue with the data on the following address"
            />
        );
    }
}

export default AddressResult;
export { instanceOfDataType, SuccessAddress };