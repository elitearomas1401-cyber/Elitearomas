function adminPanel() {
    return {
        products: [],
        search: '',
        filterCat: 'all',
        showModal: false,
        editMode: false,
        form: { id: null, name: '', desc: '', price: '', cat: 'perfumes', image: '' },
        toast: { show: false, title: '', msg: '' },

        // Configuración de GitHub
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
            this.loadProducts();
            this.github.token = localStorage.getItem('gh_token') || '';
        },

        loadProducts() {
            const stored = localStorage.getItem('elite_products');
            if (stored) {
                this.products = JSON.parse(stored);
            } else if (typeof MENU !== 'undefined') {
                this.products = MENU;
                this.saveToDisk();
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

        openModal(mode, product = null) {
            this.editMode = mode === 'edit';
            if (this.editMode && product) {
                this.form = { ...product };
            } else {
                this.form = { id: Date.now(), name: '', desc: '', price: '', cat: 'perfumes', image: '', emoji: '✨' };
            }
            this.showModal = true;
        },

        saveProduct() {
            if (this.editMode) {
                const index = this.products.findIndex(p => p.id === this.form.id);
                if (index !== -1) this.products[index] = { ...this.form };
                this.showToast('Actualizado', 'Producto actualizado localmente');
            } else {
                this.products.push({ ...this.form });
                this.showToast('Guardado', 'Agregado al almacenamiento local');
            }
            this.saveToDisk();
            this.showModal = false;
        },

        deleteProduct(id) {
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                this.products = this.products.filter(p => p.id !== id);
                this.saveToDisk();
                this.showToast('Eliminado', 'Producto borrado');
            }
        },

        saveToDisk() {
            localStorage.setItem('elite_products', JSON.stringify(this.products));
        },

        async publishToGitHub() {
            if (!this.github.token) {
                const token = prompt("Ingresa tu GitHub Personal Access Token para publicar:");
                if (!token) return;
                this.github.token = token;
                localStorage.setItem('gh_token', token);
            }

            this.showToast('Publicando...', 'Sincronizando con GitHub y Netlify');

            try {
                // 1. Obtener el SHA del archivo actual
                const res = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    headers: { 'Authorization': `token ${this.github.token}` }
                });
                const fileData = await res.json();

                // 2. Preparar el nuevo contenido (reescribimos el archivo data.js)
                const newContent = `const MENU = ${JSON.stringify(this.products, null, 2)};`;
                const encodedContent = btoa(unescape(encodeURIComponent(newContent)));

                // 3. Hacer el Commit
                const updateRes = await fetch(`https://api.github.com/repos/${this.github.repo}/contents/${this.github.path}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.github.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: "Actualización de catálogo desde Panel Admin",
                        content: encodedContent,
                        sha: fileData.sha,
                        branch: this.github.branch
                    })
                });

                if (updateRes.ok) {
                    this.showToast('¡Éxito!', 'Los cambios estarán vivos en Netlify en 1 minuto');
                } else {
                    throw new Error('Error al actualizar');
                }
            } catch (err) {
                console.error(err);
                this.showToast('Error', 'No se pudo publicar. Revisa tu Token y Repo.');
            }
        },

        showToast(title, msg) {
            this.toast = { show: true, title, msg };
            setTimeout(() => this.toast.show = false, 4000);
        },

        logout() {
            localStorage.removeItem('admin_logged');
            window.location.href = 'login.html';
        }
    }
}
