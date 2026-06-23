const { createApp, ref } = Vue; // Typo diperbaiki di sini

// Definisikan Alamat Backend API Server Anda
const API_URL = 'http://localhost:8080/api'; 
axios.defaults.baseURL = API_URL;

// 1. Konfigurasi Axios Interceptors 
// Menyuntikkan token dari localStorage secara otomatis ke setiap Request Header
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Menangkap Error 401 Unauthorized secara global jika sesi habis
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            alert('Sesi Anda telah habis/tidak sah. Silakan login kembali.'); 
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('token'); 
            window.location.hash = '/login'; // Tendang pengguna kembali ke login
        }
        return Promise.reject(error);
    }
);

// 2. Definisi Rute SPA
const routes = [
    { path: '/', component: HomeComponent }, // Publik
    { path: '/login', component: LoginComponent }, // Form Login
    { 
        path: '/dashboard', 
        component: DashboardComponent,
        meta: { requiresAuth: true }, // Proteksi Rute Panel Admin
        children: [
            { path: '', component: BarangComponent } // Kelola Barang Terintegrasi
        ]
    }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(), // Mode Hash sudah aktif
    routes
});

// 3. Client-Side Security (Navigation Guards) 
// Mencegah akses ilegal dari pengguna yang belum login
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'; 
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/login'); // Buang paksa ke login jika ilegal
    } else {
        next();
    }
});

// 4. Instansiasi Aplikasi Vue
const app = createApp({}); // Disesuaikan menggunakan fungsi bawaan Vue yang benar
app.use(router);
app.mount('#app');