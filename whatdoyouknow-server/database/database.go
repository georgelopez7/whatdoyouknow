package database

import (
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DBClient *sqlx.DB

func ConnectDB() {

	// --- CONNECT TO DATABASE ---
	db, err := sqlx.Connect("postgres", os.Getenv("POSTGRES_DB_URL"))
	if err != nil {
		log.Fatalln(err)
	}

	// --- TEST DATABASE CONNECTION ---
	if err := db.Ping(); err != nil {
		log.Fatal("Database connection failed: ", err)
	}

	// --- SET GLOBAL DATABASE CLIENT ---
	DBClient = db
}
