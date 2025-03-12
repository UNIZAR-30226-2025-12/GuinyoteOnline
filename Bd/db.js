const mongoose = require('mongoose');
const dns = require('dns');
const os = require('os');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('La variable de entorno MONGO_URI no está configurada');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            ssl: true,
            tls: true,
            retryWrites: true,
            w: "majority"
        });

        // Mostrar información de conexión inmediatamente después de conectar
        console.log('Base de datos conectada correctamente');
        console.log('Información de conexión:');
        console.log('Host:', conn.connection.host);
        console.log('Puerto:', conn.connection.port);
        console.log('Base de datos:', conn.connection.name);
        console.log('Cliente:', conn.connection.client.address);
        
        // Eventos de conexión para monitoreo continuo
        mongoose.connection.on('error', (err) => {
            console.error('Error en la conexión de MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB desconectado');
        });

        // Manejo de señales de cierre
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('Conexión a MongoDB cerrada por finalización de la aplicación');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

// Configuraciones globales de Mongoose
mongoose.set('strictQuery', true);  // Para prepararse para Mongoose 7
mongoose.set('debug', process.env.NODE_ENV === 'development'); // Log de queries en desarrollo

module.exports = {
    connectDB,
    getConnection: () => mongoose.connection
}; 
