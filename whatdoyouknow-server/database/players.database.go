package database

import (
	"database/sql"
	"errors"
	"fmt"
)

type PlayerRecordDB struct {
	ID       string `db:"id" json:"id"`
	Name     string `db:"name" json:"name"`
	RoomCode string `db:"room_code" json:"room_code"`
	Score    int    `db:"score" json:"score"`
	IsHost   bool   `db:"is_host" json:"is_host"`
}

func FetchPlayersByRoomCodeFromDB(roomCode string) ([]PlayerRecordDB, error) {
	players := make([]PlayerRecordDB, 0)

	// --- QUERY DATABASE ---
	query := `SELECT * FROM players WHERE room_code = $1`
	err := DBClient.Select(&players, query, roomCode)
	if err != nil {
		fmt.Println(err)
		if errors.Is(err, sql.ErrNoRows) {
			return players, nil
		}
		return players, err
	}

	return players, nil
}

func AddPlayerToDB(name string, roomCode string, isHost bool) (PlayerRecordDB, error) {

	var player PlayerRecordDB

	// --- QUERY DATABASE ---
	query := `INSERT INTO players (name, room_code, is_host) VALUES ($1, $2, $3) RETURNING *`
	err := DBClient.Get(&player, query, name, roomCode, isHost)
	if err != nil {
		return player, err
	}

	return player, nil
}

func IncrementPlayerScoreByID(playerID string, increment int) (PlayerRecordDB, error) {
	var player PlayerRecordDB

	// --- QUERY DATABASE ---
	query := `UPDATE players SET score = score + $1 WHERE id = $2 RETURNING *`
	err := DBClient.Get(&player, query, increment, playerID)
	if err != nil {
		return player, err
	}

	return player, nil
}

func DeletePlayerFromDB(playerID string) error {
	query := `DELETE FROM players WHERE id = $1`
	result, err := DBClient.Exec(query, playerID)
	if err != nil {
		return err
	}

	// --- CHECK IF ROWS AFFECTED ---
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return nil
	}

	return nil
}
