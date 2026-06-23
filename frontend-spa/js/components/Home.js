const HomeComponent = {
    data() {
        return {
            summary: { total_barang: 0, total_stok: 0, total_kategori: 0 }
        }
    },
    mounted() {
        // Mendapatkan ringkasan total data tanpa token [cite: 55]
        axios.get('/barang/summary')
            .then(res => { this.summary = res.data; })
            .catch(err => console.error(err));
    },
    template: `
        <div class="min-h-screen flex flex-col justify-between">
            <nav class="bg-white shadow-sm border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
                    <span class="font-bold text-xl tracking-tight text-slate-950">E-Inventory</span>
                </div>
                <router-link to="/login" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-xl transition duration-200 shadow-sm text-sm">
                    Masuk Dashboard →
                </router-link>
            </nav>

            <main class="max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center text-center">
                <span class="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">UAS Pemrograman Web 2</span>
                <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight">
                    Kelola Stok & Inventaris Barang Perusahaan <span class="text-indigo-600">Jauh Lebih Efisien</span>
                </h1>
                <p class="mt-4 text-slate-500 max-w-xl text-base md:text-lg">
                    Sistem pemantauan komoditas barang, klasifikasi kategori, serta pelacakan real-time berbasis arsitektur decoupled modern. [cite: 4]
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-12 max-w-4xl">
                    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Macam Barang</span>
                        <span class="text-3xl font-bold text-slate-900 mt-2">{{ summary.total_barang }} Item</span>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Akumulasi Stok</span>
                        <span class="text-3xl font-bold text-indigo-600 mt-2">{{ summary.total_stok }} Pcs</span>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                        <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Kategori Terdaftar</span>
                        <span class="text-3xl font-bold text-slate-900 mt-2">{{ summary.total_kategori }} Group</span>
                    </div>
                </div>
            </main>

            <footer class="bg-white border-t border-slate-100 text-center py-6 text-xs font-medium text-slate-400">
                &copy; 2026 Tugas Akhir Proyek Mandiri Web 2. All Rights Reserved. [cite: 3]
            </footer>
        </div>
    `
};