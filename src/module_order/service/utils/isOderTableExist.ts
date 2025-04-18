import { DataSource } from "typeorm"

const isOderTableExist = async (dataSource: DataSource) => {
    const tableExists = await dataSource.query(
        `SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'orders'
        );`
    );
    return tableExists[0].exists;
}

export default isOderTableExist;
