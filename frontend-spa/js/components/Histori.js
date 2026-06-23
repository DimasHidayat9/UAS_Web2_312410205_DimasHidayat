const HistoriComponent = {
    data() {
        return {
            histori: [],
            barangList: [],
            loading: false,
            showModal: false,
            form: {
                id_barang: '',
                jenis: 'masuk',
                jumlah: '',
                keterangan: ''
            },
            errorMessage: ''
        }
    },
    mounted() {
        this.fetchHistori();
        this.fetchBarang();
    },
    methods: {
        fetchHistori() {
            this.loading = true;
            axios.get('/histori')
                .then(res => { this.histori = res.data; })
                .catch(err => { console.error(err); })
                .finally(() => { this.loading = false; });
        },
        fetchBarang() {
            axios.get('/barang')
                .then(res => { this.barangList = res.data; })
                .catch(err => { console.error(err); });
        },
        openModal() {
            this.form = { id_barang: '', jenis: 'masuk', jumlah: '', keterangan: '' };
            this.errorMessage = '';
            this.showModal = true;
        },
        submitHistori() {
            if (!this.form.id_barang || !this.form.jumlah) {
                this.errorMessage = 'Barang dan jumlah wajib diisi!';
                return;
            }
            axios.post('/histori', this.form)
                .then(() => {
                    this.showModal = false;
                    this.fetchHistori();
                    this.fetchBarang();
                })
                .catch(err => {
                    this.errorMessage = err.response?.data?.error || 'Gagal menyimpan histori';
                });
        },
        deleteHistori(id) {
            if (!confirm('Hapus histori ini?')) return;
            axios.delete('/histori/' + id)
                .then(() => { this.fetchHistori(); })
                .catch(err => { console.error(err); });
        },
        formatTanggal(ts) {
            return new Date(ts).toLocaleString('id-ID');
        },
        formatRupiah(num) {
            return 'Rp ' + Number(num).toLocaleString('id-ID');
        }
    },
    template: `
        <div>
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-bold text-slate-800">Histori Barang Masuk & Keluar</h2>
                    <p class="text-sm text-slate-400 mt-1">Riwayat pergerakan stok barang</p>
                </div>
                <button @click="openModal" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2">
                    + Catat Histori
                </button>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div v-if="loading" class="text-center py-10 text-slate-400">Memuat data...</div>
                <table v-else class="w-full text-sm">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Tanggal</th>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Nama Barang</th>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Supplier</th>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Jenis</th>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Jumlah</th>
                            <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Keterangan</th>
                            <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-if="histori.length === 0">
                            <td colspan="7" class="text-center py-10 text-slate-400">Belum ada histori</td>
                        </tr>
                        <tr v-for="h in histori" :key="h.id" class="hover:bg-slate-50 transition">
                            <td class="px-6 py-4 text-slate-500 whitespace-nowrap">{{ formatTanggal(h.created_at) }}</td>
                            <td class="px-6 py-4 font-medium text-slate-800">{{ h.nama_barang }}</td>
                            <td class="px-6 py-4 text-slate-500">{{ h.supplier }}</td>
                            <td class="px-6 py-4">
                                <span :class="h.jenis === 'masuk' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2.5 py-1 rounded-full text-xs font-semibold capitalize">
                                    {{ h.jenis }}
                                </span>
                            </td>
                            <td class="px-6 py-4 font-semibold" :class="h.jenis === 'masuk' ? 'text-green-600' : 'text-red-500'">
                                {{ h.jenis === 'masuk' ? '+' : '-' }}{{ h.jumlah }} Pcs
                            </td>
                            <td class="px-6 py-4 text-slate-500">{{ h.keterangan || '-' }}</td>
                            <td class="px-6 py-4 text-right">
                                <button @click="deleteHistori(h.id)" class="text-red-500 hover:text-red-700 font-semibold text-xs border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal Tambah Histori -->
            <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h3 class="text-lg font-bold text-slate-800 mb-4">Catat Histori Barang</h3>

                    <div v-if="errorMessage" class="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
                        ⚠️ {{ errorMessage }}
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nama Barang</label>
                            <select v-model="form.id_barang" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600">
                                <option value="">-- Pilih Barang --</option>
                                <option v-for="b in barangList" :key="b.id" :value="b.id">{{ b.nama_barang }} (Stok: {{ b.stok }})</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Jenis</label>
                            <select v-model="form.jenis" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600">
                                <option value="masuk">Barang Masuk</option>
                                <option value="keluar">Barang Keluar</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Jumlah</label>
                            <input type="number" v-model="form.jumlah" min="1" placeholder="Masukkan jumlah" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Keterangan</label>
                            <input type="text" v-model="form.keterangan" placeholder="Opsional" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600">
                        </div>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button @click="showModal = false" class="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Batal</button>
                        <button @click="submitHistori" class="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `
};