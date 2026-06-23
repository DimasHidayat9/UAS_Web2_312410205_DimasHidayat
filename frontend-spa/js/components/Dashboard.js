const DashboardComponent = {
    components: {
        BarangComponent,
        HistoriComponent,
        SupplierComponent
    },
    data() {
        return {
            username: localStorage.getItem('username') || 'Admin',
            activeMenu: 'barang'
        }
    },
    methods: {
        logout() {
            axios.post('/logout').finally(() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                this.$router.push('/login');
            });
        }
    },
    template: `
        <div class="flex h-screen bg-slate-100 overflow-hidden">
            <aside class="w-64 bg-slate-900 flex flex-col flex-shrink-0">
                <div class="px-6 py-5 border-b border-slate-700">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
                        <span class="text-white font-bold text-lg">E-Inventory</span>
                    </div>
                </div>
                <nav class="flex-1 px-4 py-4 space-y-1">
                    <button @click="activeMenu = 'barang'" :class="activeMenu === 'barang' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition">
                        <span>📦</span> Data Master Barang
                    </button>
                    <button @click="activeMenu = 'supplier'" :class="activeMenu === 'supplier' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition">
                        <span>🏭</span> Data Supplier
                    </button>
                    <button @click="activeMenu = 'histori'" :class="activeMenu === 'histori' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition">
                        <span>📋</span> Histori Barang
                    </button>
                </nav>
                <div class="px-4 py-4 border-t border-slate-700">
                    <button @click="logout" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition">
                        <span>🚪</span> Log Out Sesi
                    </button>
                </div>
            </aside>

            <div class="flex-1 flex flex-col overflow-hidden">
                <header class="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
                    <h1 class="text-lg font-bold text-slate-800">Control Panel</h1>
                    <span class="text-sm text-slate-500 flex items-center gap-2">
                        <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                        User: {{ username }}
                    </span>
                </header>
                <main class="flex-1 overflow-y-auto p-8">
                    <BarangComponent v-if="activeMenu === 'barang'" />
                    <SupplierComponent v-if="activeMenu === 'supplier'" />
                    <HistoriComponent v-if="activeMenu === 'histori'" />
                </main>
            </div>
        </div>
    `
};