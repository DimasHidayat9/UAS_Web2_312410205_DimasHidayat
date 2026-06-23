const BarangComponent = {
    data() {
        return {
            items: [],
            categories: [],
            showModal: false,
            isEditMode: false,
            form: { id: null, id_kategori: '', nama_barang: '', stok: 0, harga: 0, supplier: '' }
        }
    },
    mounted() {
        this.fetchData();
        this.fetchCategories();
    },
    methods: {
        fetchData() {
            axios.get('/barang')
                .then(res => { this.items = res.data; })
                .catch(err => console.error(err));
        },
        fetchCategories() {
            axios.get('/kategori')
                .then(res => { this.categories = res.data; })
                .catch(err => console.error(err));
        },
        openAddModal() {
            this.isEditMode = false;
            this.form = { id: null, id_kategori: '', nama_barang: '', stok: 0, harga: 0, supplier: '' };
            this.showModal = true;
        },
        openEditModal(item) {
            this.isEditMode = true;
            this.form = { ...item };
            this.showModal = true;
        },
        handleSubmit() {
            if (this.isEditMode) {
                // Tembak RESTful API PUT untuk Update [cite: 25]
                axios.put(`/barang/${this.form.id}`, this.form)
                    .then(res => {
                        alert('Data barang sukses diubah!');
                        this.showModal = false;
                        this.fetchData();
                    }).catch(err => alert(err.response?.data?.error || 'Gagal mengubah data'));
            } else {
                // Tembak RESTful API POST untuk Insert [cite: 25]
                axios.post('/barang', this.form)
                    .then(res => {
                        alert('Barang baru sukses dimasukkan!');
                        this.showModal = false;
                        this.fetchData();
                    }).catch(err => alert(err.response?.data?.error || 'Gagal menambah data'));
            }
        },
        deleteItem(id) {
            if (confirm('Hapus item barang ini secara permanen dari gudang?')) {
                // Tembak RESTful API DELETE untuk Hapus [cite: 25, 56]
                axios.delete(`/barang/${id}`)
                    .then(res => {
                        alert('Barang telah dihapus.');
                        this.fetchData();
                    }).catch(err => alert(err.response?.data?.error || 'Gagal menghapus data'));
            }
        },
        formatRupiah(val) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
        }
    },
    template: `
        <div>
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h3 class="text-lg font-bold text-slate-900">Daftar Inventaris Barang</h3>
                    <p class="text-xs text-slate-400">Total data komoditas pergudangan aktif</p>
                </div>
                <button @click="openAddModal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2">
                    <span>➕</span> <span>Tambah Barang</span> </button>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th class="px-6 py-4">Nama Barang</th>
                                <th class="px-6 py-4">Kategori</th>
                                <th class="px-6 py-4">Stok</th>
                                <th class="px-6 py-4">Harga Satuan</th>
                                <th class="px-6 py-4">Supplier</th>
                                <th class="px-6 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
                            <tr v-for="item in items" :key="item.id" class="hover:bg-slate-50/50 transition">
                                <td class="px-6 py-4 font-semibold text-slate-900">{{ item.nama_barang }}</td>
                                <td class="px-6 py-4">
                                    <span class="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium">{{ item.nama_kategori }}</span>
                                </td>
                                <td class="px-6 py-4 font-mono font-medium" :class="item.stok < 20 ? 'text-red-500' : 'text-slate-600'">{{ item.stok }} Pcs</td>
                                <td class="px-6 py-4 font-medium">{{ formatRupiah(item.harga) }}</td>
                                <td class="px-6 py-4 text-slate-500 text-xs">{{ item.supplier }}</td>
                                <td class="px-6 py-4 text-center space-x-2">
                                    <button @click="openEditModal(item)" class="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg transition">Edit</button> <button @click="deleteItem(item.id)" class="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg transition">Hapus</button> </td>
                            </tr>
                            <tr v-if="items.length === 0">
                                <td colspan="6" class="text-center py-8 text-slate-400 text-sm">Belum ada komoditas inventaris terdaftar.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h4 class="font-bold text-slate-900">{{ isEditMode ? 'Form Modifikasi Barang' : 'Tambah Inventaris Baru' }}</h4>
                        <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-xl font-semibold">&times;</button>
                    </div>
                    <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Komoditas Barang</label>
                            <input type="text" v-model="form.nama_barang" required class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
                                <select v-model="form.id_kategori" required class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none">
                                    <option value="" disabled>Pilih</option>
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nama_kategori }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Kuantitas / Stok</label>
                                <input type="number" v-model.number="form.stok" required min="0" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-600 mb-1">Harga Satuan (IDR)</label>
                                <input type="number" v-model.number="form.harga" required min="0" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Perusahaan Supplier</label>
                            <input type="text" v-model="form.supplier" required class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none">
                        </div>
                        <div class="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                            <button type="button" @click="showModal = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition">Batalkan</button>
                            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition">Simpan Data</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
};