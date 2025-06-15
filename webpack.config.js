const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './public/pages/index.js', // Главный JS-файл
    output: {
        filename: 'bundle.js', // Итоговый файл
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Исходный HTML
            filename: 'index.html',
        }),
    ],
    mode: 'production',
};
