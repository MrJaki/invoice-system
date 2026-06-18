-- ==========================================
-- VRSTE_IZJAV
-- ==========================================

CREATE TABLE vrste_izjav (
    id SERIAL PRIMARY KEY,
    sifra VARCHAR(20) NOT NULL,
    tarifa VARCHAR(20) NOT NULL,
    tip_davka VARCHAR(10),
    stopnja NUMERIC(5,2) NOT NULL,
    opis VARCHAR(50) NOT NULL
);

-- ==========================================
-- KOMITENTI
-- ==========================================

CREATE TABLE komitenti (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    pravni_naziv VARCHAR(255),
    dodatni_naziv VARCHAR(255),
    ulica VARCHAR(255),
    mesto VARCHAR(255),

    id_vrsta_izjave INTEGER REFERENCES vrste_izjav(id),

    davcna_st VARCHAR(20),
    zavezanec BOOLEAN DEFAULT FALSE
);

-- ==========================================
-- RACUNI
-- ==========================================

CREATE TABLE racuni (
    id SERIAL PRIMARY KEY,

    id_komitenta INTEGER
        REFERENCES komitenti(id)
        ON DELETE SET NULL,

    znesek NUMERIC(12,2) NOT NULL DEFAULT 0,

    datum_izstavitve DATE NOT NULL,
    datum_valute DATE NOT NULL,
    datum_placila DATE,

    stevilka_racuna VARCHAR(50) NOT NULL UNIQUE
);

-- ==========================================
-- VRSTICE_RACUNA
-- ==========================================

CREATE TABLE vrstice_racuna (
    id SERIAL PRIMARY KEY,

    id_racuna INTEGER NOT NULL
        REFERENCES racuni(id)
        ON DELETE CASCADE,

    kolicina NUMERIC(12,2) CHECK (kolicina >= 0),

    tip_kolicine VARCHAR(50),

    opis TEXT,

    cena NUMERIC(12,2) CHECK (cena >= 0)
);

-- ==========================================
-- UPORABNIKI
-- ==========================================

CREATE TABLE uporabniki (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    ime VARCHAR(100),
    priimek VARCHAR(100),
    vloga VARCHAR(20) NOT NULL DEFAULT 'uporabnik',  -- 'admin' / 'uporabnik'
    aktiven BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ==========================================
-- KODE ZA POVABILO
-- ==========================================

CREATE TABLE kode_povabilo (
    id SERIAL PRIMARY KEY,
    koda VARCHAR(50) UNIQUE NOT NULL,
    veljavnost_do TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    uporabljena BOOLEAN NOT NULL DEFAULT FALSE
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_racuni_komitent
    ON racuni(id_komitenta);

CREATE INDEX idx_vrstice_racuna_racun
    ON vrstice_racuna(id_racuna);