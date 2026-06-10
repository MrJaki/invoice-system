CREATE DATABASE izdaja_racunov
GO 
USE izdaja_racunov

-- ==========================================
-- VRSTE_IZJAV
-- ==========================================

CREATE TABLE vrste_izjav (
    id SERIAL PRIMARY KEY,
    tarifa VARCHAR(20) NOT NULL,
    opis_davka VARCHAR(255),
    tip_davka VARCHAR(10),
    stopnja NUMERIC(5,2) NOT NULL
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

    id_komitenta INTEGER NOT NULL
        REFERENCES komitenti(id)
        ON DELETE SET NULL,

    znesek NUMERIC(12,2) NOT NULL DEFAULT 0,

    datum_izstavitve DATE NOT NULL,
    datum_valute DATE NOT NULL,
    datum_plačila DATE,

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

    kolicina NUMERIC(12,2) NOT NULL CHECK (kolicina > 0),

    tip_kolicine VARCHAR(50) NOT NULL,

    opis TEXT,

    cena NUMERIC(12,2) NOT NULL CHECK (cena >= 0)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_racuni_komitent
    ON racuni(id_komitenta);

CREATE INDEX idx_vrstice_racuna_racun
    ON vrstice_racuna(id_racuna);