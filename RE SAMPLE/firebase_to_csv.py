#!/usr/bin/env python3
"""
Firebase JSON to CSV Converter for TOJ Experiment
==================================================

This script converts the JSON export from Firebase Realtime Database
into a clean CSV file for analysis.

USAGE:
------
1. Go to Firebase Console > Realtime Database
2. Click the three dots menu (⋮) next to your database
3. Click "Export JSON"
4. Save the file (e.g., "toj-experiment-export.json")
5. Run this script:

   python3 firebase_to_csv.py toj-experiment-export.json

   Or with a custom output filename:

   python3 firebase_to_csv.py toj-experiment-export.json my_data.csv

OUTPUT:
-------
Creates a CSV file with all trials from all participants,
sorted by participant and trial number.
"""

import json
import csv
import sys
from datetime import datetime


def flatten_firebase_data(json_data):
    """
    Flatten the nested Firebase JSON structure into a list of trial dictionaries.

    Firebase structure:
    {
        "experiments": {
            "P001": {
                "1706123456789": { trial_data },
                "1706123456790": { trial_data },
                ...
            },
            "P002": { ... }
        }
    }
    """
    all_trials = []

    # Navigate to experiments node
    experiments = json_data.get('experiments', json_data)

    for participant_id, participant_data in experiments.items():
        if isinstance(participant_data, dict):
            for timestamp, trial_data in participant_data.items():
                if isinstance(trial_data, dict):
                    # Add the Firebase timestamp as a field
                    trial_data['firebase_timestamp'] = timestamp
                    all_trials.append(trial_data)

    return all_trials


def convert_to_csv(json_file, csv_file=None):
    """
    Convert Firebase JSON export to CSV.
    """
    # Generate default output filename if not provided
    if csv_file is None:
        timestamp = datetime.now().strftime('%Y-%m-%d_%H%M%S')
        csv_file = f'toj_data_{timestamp}.csv'

    # Read JSON file
    print(f"Reading {json_file}...")
    with open(json_file, 'r') as f:
        data = json.load(f)

    # Flatten the data
    trials = flatten_firebase_data(data)

    if not trials:
        print("No trial data found in the JSON file.")
        return

    print(f"Found {len(trials)} trials")

    # Get all unique column names across all trials
    all_columns = set()
    for trial in trials:
        all_columns.update(trial.keys())

    # Define preferred column order (important columns first)
    preferred_order = [
        'participant_id',
        'session_date',
        'trial_number',
        'block_number',
        'trial_in_block',
        'condition',
        'accuracy',
        'reaction_time',
        'response_side',
        'correct_answer',
        'target_position',
        'distractor_position',
        'lag',
        'lag_category',
        'target_beat_strength',
        'distractor_beat_strength',
        'chosen_position',
        'target_side',
        'target_filename',
        'distractor_filename',
        'left_image',
        'right_image',
        'sequence_filenames',
        'previous_condition',
        'previous_correct',
        'sync_offset_ms',
        'audio_duration_actual_ms',
        'expected_encoding_duration_ms',
        'rep_duration_ms',
        'volume_level',
        'experiment_start_time',
        'trial_start_time',
        'window_resolution',
        'browser_info',
        'is_practice',
        'phase',
        'task',
        'firebase_timestamp'
    ]

    # Create final column order: preferred columns first, then any remaining
    columns = [col for col in preferred_order if col in all_columns]
    remaining = sorted(all_columns - set(columns))
    columns.extend(remaining)

    # Sort trials by participant and trial number
    trials.sort(key=lambda x: (
        str(x.get('participant_id', '')),
        int(x.get('trial_number', 0)) if str(x.get('trial_number', '')).isdigit() else 0
    ))

    # Write CSV
    print(f"Writing {csv_file}...")
    with open(csv_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(trials)

    print(f"Successfully converted {len(trials)} trials to {csv_file}")

    # Print summary
    participants = set(t.get('participant_id', 'unknown') for t in trials)
    print(f"\nSummary:")
    print(f"  Participants: {len(participants)}")
    print(f"  Total trials: {len(trials)}")
    for p in sorted(participants):
        p_trials = [t for t in trials if t.get('participant_id') == p]
        print(f"    {p}: {len(p_trials)} trials")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("\nError: Please provide a JSON file to convert.")
        print("Usage: python3 firebase_to_csv.py <input.json> [output.csv]")
        sys.exit(1)

    json_file = sys.argv[1]
    csv_file = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        convert_to_csv(json_file, csv_file)
    except FileNotFoundError:
        print(f"Error: File '{json_file}' not found.")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON file. {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
