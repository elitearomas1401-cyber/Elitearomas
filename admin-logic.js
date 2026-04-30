function adminPanel() {
    return {
        products: [],
        config: { phone: '', categories: [] },
        search: '',
        filterCat: 'all',
        showModal: false,
        editMode: false,
        form: { id: null, name: '', desc: '', price: '', cat: '', image: '' },
        toast: { show: false, title: '', msg: '' },

        github: {
            token: '',
            repo: 'elitearomas1401-cyber/Elitearomas',
            path: 'js/data.js',
            branch: 'main'
        },

        init() {
            if (localStorage.getItem('admin_logged') !== 'true') {
                window.location.href = 'login.html';
            }
            this.loadData();
            this.github.token = localStorage.getItem('gh_token') || '';
        },

        loadData() {
            // Cargar Config
            const storedConfig = localStorage.getItem('elite_config');
            if (storedConfig) {
                this.config = JSON.parse(storedConfig);
            } else if (typeof CONFIG !== 'undefined') {
                this.config = CONFIG;
                localStorage.setItem('elite_config', JSON.stringify(this.config));
            }

            // Cargar Productos
            const storedProds = localStorage.getItem('elite_products');
            if (storedProds) {
                this.products = JSON.parse(storedProds);
            } else if (typeof MENU !== 'undefined') {
                this.products = MENU;
                localStorage.setItem('elite_products', JSON.stringify(this.products));
            }
        },

        get filteredProducts() {
            return this.products.filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(this.search.toLowerCase());
                const matchesCat = this.filterCat === 'all' || p.cat === this.filterCat;
                return matchesSearch && matchesCat;
            });
        },

        countCat(cat) {
            return this.products.filter(p => p.cat === cat).length;
        },

        saveConfig() {
            localStorage.setItem('elite_config', JSON.stringify(this.config));
            this.showToast('Configuración Guardada', 'El teléfono ha sido actualizado localmente');
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validar tamaño (máximo 2MB para no sobrecargar el JSON)
            if (file.size > 2 * 1024 * 1024) {
                alert("La imagen es muy pesada. Máximo 2MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.form.image = e.target.result; // Esto guarda la imagen en Base64
            };
            reader.readAsDataURL(file);
        },

        checkNewCat(e) {
            if (e.target.value === 'NEW') {
                const newCat = prompt("Ingresa el nombre de la nueva categoría:");
                if (newCat && newCat.trim() !== '') {
                    const cleanCat = newCat.trim().toLowerCase();
                    if (!this.config.categories.includes(cleanCat)) {
                        this.config.categories.push(cleanCat);
                        localStorage.setItem('elite_config', JSON.stringify(this.config));
                    }
                    this.form.cat = cleanCat;
                } else {
                    this.form.cat = this.config.categories[0];
                }
            }
        },

        openModal(mode, product = null) {
            this.editMode = mode === 'edit';
            if (this.editMode && product) {
                this.form = { ...product };
            } else {
                this.form = {
                    id: Date.now(),
                    name: '',
                    desc: '',
                    price: '',
                    cat: this.config.categories[0] || '',
                    image: '',
                    emoji: '✨'
                };
            }
            this.showModal = true;
        },

        saveProduct() {
            if (this.editMode) {
                const index = this.products.findIndex(p => p.id === this.form.id);
                if (index !== -1) this.products[index] = { ...this.form };
            } else {
                this.products.push({ ...this.form });
            }
            localStorage.setItem('elite_products', JSON.stringify(this.products));
            this.showToast('Guardado', 'Los cambios se guardaron localmente');
            this.showModal = false;
        },

        deleteProduct(id) {
            if (confirm('¿Eliminar este producto?')) {
                this.products = this.products.filter(p => p.id !== id);
                localStorage.setItem('elite_products', JSON.stringify(this.products));
                this.showToast('Eliminado', 'Producto borrado');
            }
        },

        async publishToGitHub() {
            if (!this.github.token) {
                const token = prompt("Ingresa tu GitHub Token:");
                if (!token) return;
                this.github.token = token;
                localStorage.setItem('gh_token', token);
            }

            this.showToast('Publicando...', 'Sincronizando catálogo y configuración...');

            try {
                const res = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    headers: { 'Authorization': `token ${this.github.token}` }
                });
                const fileData = await res.json();

                // Generar contenido del archivo js/data.js incluyendo CONFIG y MENU
                const newContent = `
const CONFIG = ${JSON.stringify(this.config, null, 2)};

const MENU = ${JSON.stringify(this.products, null, 2)};

const GRADIENTS = {}; // Mantener si es necesario
                `.trim();

                const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

                const updateRes = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.github.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: "Update Catalog & Config from Admin",
                        content: encodedContent,
                        sha: fileData.sha,
                        branch: this.github.branch
                    })
                });

                if (updateRes.ok) {
                    this.showToast('¡Éxito!', 'Catálogo y teléfono actualizados en la web');
                } else {
                    throw new Error('Error al actualizar');
                }
            } catch (err) {
                console.error(err);
                this.showToast('Error', 'No se pudo publicar. Revisa tu Token.');
            }
        },

        showToast(title, msg) {
            this.toast = { show: true, title, msg };
            setTimeout(() => this.toast.show = false, 3000);
        },

        logout() {
            localStorage.removeItem('admin_logged');
            window.location.href = 'login.html';
        }
    }
}
