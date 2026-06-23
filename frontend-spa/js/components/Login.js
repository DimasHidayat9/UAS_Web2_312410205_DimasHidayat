const LoginComponent = {
    data() {
        return {
            username: '',
            password: '',
            loading: false,
            errorMessage: ''
        }
    },
    methods: {
        handleLogin() {
            this.loading = true;
            this.errorMessage = '';
            
            axios.post('/login', {
                username: this.username,
                password: this.password
            })
            .then(res => {
                if (res.status === 200 || res.data.status === 200) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('token', res.data.token || 'dummy-token');
                    localStorage.setItem('username', res.data.username || this.username);
                    
                    this.$router.push('/dashboard'); 
                }
            })
            .catch(err => {
                // PERBAIKAN 2: Mencetak error ke console browser agar mudah di-debug (Tekan F12)
                console.error("Detail Error API:", err);
                
                // Menampilkan pesan error
                this.errorMessage = err.response?.data?.error || 'Koneksi ke API Server Gagal. Cek console browser (F12).';
            })
            .finally(() => {
                this.loading = false;
            });
        }
    },
    template: `
        <div class="min-h-screen flex items-center justify-center px-4 bg-slate-100">
            <div class="max-w-md w-full bg-white rounded-3xl border border-slate-200/60 shadow-xl p-8">
                <div class="text-center mb-6">
                    <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-md">E</div>
                    <h2 class="text-2xl font-bold text-slate-900 mt-4 tracking-tight">Selamat Datang Kembali</h2>
                    <p class="text-xs text-slate-400 mt-1">Gunakan akun administrator untuk mengelola inventaris</p>
                </div>

                <div v-if="errorMessage" class="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded-xl flex items-center space-x-2">
                    <span>⚠️ {{ errorMessage }}</span>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Username</label>
                        <input type="text" v-model="username" required placeholder="Masukkan username" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition duration-150">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
                        <input type="password" v-model="password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition duration-150">
                    </div>
                    <button type="submit" :disabled="loading" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition duration-150 text-sm disabled:opacity-50">
                        {{ loading ? 'Mengautentikasi...' : 'Masuk Sistem' }}
                    </button>
                </form>
                
                <div class="mt-6 text-center">
                    <router-link to="/" class="text-xs text-slate-400 hover:text-indigo-600 font-medium transition">&larr; Kembali ke Beranda Utama</router-link>
                </div>
            </div>
        </div>
    `
};