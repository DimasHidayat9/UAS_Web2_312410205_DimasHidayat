const SupplierComponent = {
    data() {
        return {
            supplierList: [],
            loading: false,
            showModal: false,
            isEdit: false,
            editId: null,
            form: { nama_supplier: '', alamat: '', no_telp: '', email: '' },
            errorMessage: ''
        }
    },
    mounted() {
        this.fetchSupplier();
    },
    methods: {
        fetchSupplier() {
            this.loading = true;
            axios.get('/supplier')
                .then(res => { this.supplierList = res.data; })
                .catch(err => { console.error(err); })
                .finally(() => { this.loading = false; });
        },
        openTambah() {
            this.isEdit = false;
            this.editId = null;
            this.form = { nama_supplier: '', alamat: '', no_telp: '', email: '' };
            this.errorMessage = '';
            this.showModal = true;
        },
        openEdit(s) {
            this.isEdit = true;
            this.editId = s.id;
            this.form = { nama_supplier: s.nama_supplier, alamat: s.alamat || '', no_telp: s.no_telp || '', email: s.email || '' };
            this.errorMessage = '';
            this.showModal = true;
        },
        submitForm() {
            if (!this.form.nama_supplier) {
                this.errorMessage = 'Nama supplier wajib diisi!';
                return;
            }
            const req = this.isEdit
                ? axios.put('/supplier/' + this.editId, this.form)
                : axios.post('/supplier', this.form);

            req.then(() => {
                this.showModal = false;
                this.fetchSupplier();
            }).catch(err => {
                this.errorMessage = err.response?.data?.error || 'Gagal menyimpan data';
            });
        },
        deleteSupplier(id) {
            if (!confirm('Hapus supplier ini? Data barang terkait tidak akan terhapus.')) return;
            axios.delete('/supplier/' + id)
                .then(() => { this.fetchSupplier(); })
                .catch(err => { console.error(err); });
        }
    },
    template: `
        <div>
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-bold text-slate-800">Data Master Supplier</h2>
                    <p class="text-sm text-slate-400 mt-1">Kelola daftar supplier barang</p>
                </div>
                <button @click="openTambah" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition">
                    + Tambah Supplier
                </button>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div v-if="loading" class="text-center py-10 text-slate-400">Memuat data...</div>
                <table v-else class="w-full text-sm">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Nama Supplier</th>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Alamat</th>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">No. Telp</th>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Email</th>
                            <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-if="supplierList.length === 0">
                            <td colspan="5" class="text-center py-10 text-slate-400">Belum ada data supplier</td>
                        </tr>
                        <tr v-for="s in supplierList" :key="s.id" class="hover:bg-slate-50 transition">
                            <td class="px-6 py-4 font-semibold text-slate-800">{{ s.nama_supplier }}</td>
                            <td class="px-6 py-4 text-slate-500">{{ s.alamat || '-' }}</td>
                            <td class="px-6 py-4 text-slate-500">{{ s.no_telp || '-' }}</td>
                            <td class="px-6 py-4 text-slate-500">{{ s.email || '-' }}</td>
                            <td class="px-6 py-4 text-right flex justify-end gap-2">
                                <button @click="openEdit(s)" class="text-amber-500 hover:text-amber-700 font-semibold text-xs border border-amber-200 hover:border-amber-400 px-3 py-1.5 rounded-lg transition">Edit</button>
                                <button @click="deleteSupplier(s.id)" class="text-red-500 hover:text-red-700 font-semibold text-xs border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h3 class="text-lg font-bold text-slate-800 mb-4">{{ isEdit ? 'Edit Supplier' : 'Tambah Supplier' }}</h3>

                    <div v-if="errorMessage" class="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
                        ⚠️ {{ errorMessage }}
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nama Supplier *</label>
                            <input type="text" v-model="form.nama_supplier" placeholder="Nama supplier" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Alamat</label>
                            <input type="text" v-model="form.alamat" placeholder="Alamat lengkap" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">No. Telp</label>
                            <input type="text" v-model="form.no_telp" placeholder="08xxxxxxxxxx" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                            <input type="email" v-model="form.email" placeholder="email@supplier.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600">
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="showModal = false" class="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Batal</button>
                        <button @click="submitForm" class="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `
};