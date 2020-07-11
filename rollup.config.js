import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default{
    input: './src/index.js',
    output: {
        file: 'dist/vue.js', 
        format: 'umd',
        name: 'Vue',
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            openPage: '/public/index.html',
            port: 3000,
            contentBase: '',
            open: true
        })
    ]
}