package database

import (
	"database/sql"
	"errors"
)

type RoomRecordDB struct {
	ID       string `db:"id" json:"id"`
	RoomCode string `db:"room_code" json:"room_code"`
	IsActive bool   `db:"is_active" json:"is_active"`
}

func FetchRoomByRoomCodeFromDB(roomCode string) (RoomRecordDB, error) {
	var room RoomRecordDB

	// --- QUERY DATABASE ---
	query := `SELECT * FROM rooms WHERE room_code = $1`
	err := DBClient.Get(&room, query, roomCode)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return room, nil
		}
		return room, err
	}

	return room, nil
}

func AddRoomToDB(roomCode string, isActive bool) (RoomRecordDB, error) {

	var room RoomRecordDB

	// --- QUERY DATABASE ---
	query := `INSERT INTO rooms (room_code, is_active) VALUES ($1, $2) RETURNING *`
	err := DBClient.Get(&room, query, roomCode, isActive)
	if err != nil {
		return room, err
	}

	return room, nil
}

func UpdateRoomStatus(roomCode string, isActive bool) (RoomRecordDB, error) {
	var room RoomRecordDB

	// --- QUERY DATABASE ---
	query := `UPDATE rooms SET is_active = $1 WHERE room_code = $2 RETURNING *`
	err := DBClient.Get(&room, query, isActive, roomCode)
	if err != nil {
		return room, err
	}

	return room, nil
}

func DeleteRoomFromDB(roomID string) error {

	// --- QUERY DATABASE ---
	query := `DELETE FROM rooms WHERE id = $1`
	result, err := DBClient.Exec(query, roomID)
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
