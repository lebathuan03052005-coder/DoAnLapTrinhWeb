import sql from 'mssql';

const config = {
    user: 'sa',
    password: '123456',
    server: 'localhost',
    database: 'HotelBooking',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        port: 1433
    }
};

const connectDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('✅ KẾT NỐI SQL SERVER THÀNH CÔNG!');
        return pool;
    } catch (err) {
        console.error('❌ Lỗi kết nối CSDL:', err);
    }
};

export { sql, connectDB };
