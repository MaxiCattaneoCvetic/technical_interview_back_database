import { DataSource } from "typeorm"

const isProductTableExist = async (dataSource: DataSource) => {
    const tableExists = await dataSource.query(
        `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'products'
        );`
    );
    return tableExists[0].exists;
}

export default isProductTableExist;
