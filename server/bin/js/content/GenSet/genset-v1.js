export default class GenSet {
  constructor(elemen, params = []) {
    this.elemen = elemen;

    // Validasi format parameter JSON
    if (!Array.isArray(params)) {
      throw new Error("Format Params Harus Berupa Array!");
    } else {
      this.params = params;
    }
  }

  // Fungsi utama untuk menghasilkan elemen berdasarkan parameter JSON
  async Generate_Elemen(params) {
    if (!params || typeof params !== 'object') {
      throw new Error("Invalid Input. Input Harus Berupa JSON");
    }

    const elemen = document.createElement(params.tag || 'div');

    // Menambahkan atribut
    if (params.attribut) {
      await this.TambahAttribut(elemen, params.attribut);
    }

    // Menambahkan kelas berdasarkan 'className'
    if (params.className) {
      elemen.className = params.className;
    }

    // Menambahkan style inline berdasarkan 'styles'
    if (params.styles) {
      await this.TambahStyle(elemen, params.styles);
    }

    // Menambahkan teks atau HTML
    if (params.text) {
      elemen.textContent = params.text;
    } else if (params.html) {
      elemen.innerHTML = params.html;
    }

    // Menambahkan nilai jika elemen adalah input atau textarea
    if (params.value !== undefined && (elemen.tagName === 'INPUT' || elemen.tagName === 'TEXTAREA')) {
      elemen.value = params.value;
    }

    // Menambahkan event listeners
    if (params.events) {
      await this.TambahEvent(elemen, params.events);
    }

    // Menambahkan children secara rekursif
    if (params.children && Array.isArray(params.children)) {
      await this.TambahChild(elemen, params.children);
    }

    // Menambahkan data attributes jika ada
    if (params.data) {
      Object.entries(params.data).forEach(([key, value]) => {
        elemen.dataset[key] = value;
      });
    }

    return elemen;
  }

  // Fungsi untuk menambahkan atribut
  async TambahAttribut(elemen, data) {
    Object.entries(data).forEach(([key, value]) => {
      elemen.setAttribute(key, value);
    });
  }

  // Fungsi untuk menambahkan style inline
  async TambahStyle(elemen, data) {
    Object.entries(data).forEach(([key, value]) => {
      elemen.style[key] = value;
    });
  }

  // Fungsi untuk menambahkan event listeners
  async TambahEvent(elemen, events) {
    Object.entries(events).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        elemen.addEventListener(event, (e) => handler(e, this.params));
      } else {
        console.warn(`Callback untuk event "${event}" bermasalah. Mungkin bukan sebuah fungsi.`);
      }
    });
  }

  // Fungsi untuk menambahkan children secara rekursif
  async TambahChild(elemen, children) {
    for (const child of children) {
      const childElemen = await this.Generate_Elemen(child);
      elemen.appendChild(childElemen);
    }
  }

  // Fungsi untuk merender elemen-elemen yang sudah di-generate
  async RenderElemen() {
    const elements = [];
    for (const param of this.params) {
      const element = await this.Generate_Elemen(param);
      elements.push(element);
    }
    return elements;
  }
}
