// routes/events.routes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth-middleware');

// Get all events
router.get('/', (req, res) => {
    db.query('SELECT * FROM events', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch events' });
        }
        res.json(results);
    });
});

// Create new event
router.post('/', (req, res) => {
    const { title, start, end, description, type } = req.body;
    
    // Validate required fields
    if (!title || !start || !end || !type) {
        return res.status(400).json({ error: 'Missing required fields: title, start, end, and type are required' });
    }

    // Validate date formats
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime())) {
        return res.status(400).json({ error: 'Invalid start date format' });
    }
    if (isNaN(endDate.getTime())) {
        return res.status(400).json({ error: 'Invalid end date format' });
    }
    if (endDate <= startDate) {
        return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Validate event type
    const validTypes = ['primary', 'info', 'success', 'danger'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid event type' });
    }

    db.query(
        'INSERT INTO events (title, start, end, description, type) VALUES (?, ?, ?, ?, ?)',
        [title, startDate, endDate, description || null, type],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to create event' });
            }
            res.status(201).json({ 
                id: result.insertId, 
                title, 
                start: startDate.toISOString(), 
                end: endDate.toISOString(), 
                description, 
                type 
            });
        }
    );
});

// Update event
router.put('/:id', (req, res) => {
    const { title, start, end, description, type } = req.body;
    
    // Validate required fields
    if (!title || !start || !end || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate date formats
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    db.query(
        'UPDATE events SET title = ?, start = ?, end = ?, description = ?, type = ? WHERE id = ?',
        [title, startDate, endDate, description || null, type, req.params.id],
        (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to update event' });
            }
            res.json({ message: 'Event updated successfully' });
        }
    );
});

// Delete event
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM events WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to delete event' });
        }
        res.json({ message: 'Event deleted successfully' });
    });
});

module.exports = router;