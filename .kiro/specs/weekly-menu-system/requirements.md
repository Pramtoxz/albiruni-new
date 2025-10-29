# Requirements Document - Weekly Menu System

## Introduction

Sistem menu mingguan untuk daycare yang memungkinkan admin membuat rencana menu per minggu dengan menu berbeda untuk kategori Anak (Toddler/Preschool/Kindergarten), Bayi (3 bulan - 1 tahun), dan Staff. Menu berubah setiap minggu dan guru akan memilih menu dari rencana mingguan yang aktif saat membuat daily report.

## Glossary

- **Menu Mingguan**: Rencana menu untuk satu minggu (Senin-Jumat) dengan tanggal mulai dan selesai
- **Menu Harian**: Item menu spesifik untuk hari tertentu, waktu makan, dan kategori
- **Kategori**: Pengelompokan menu (anak/bayi/staff)
- **Waktu Makan**: Sarapan, Makan Siang, atau Snack
- **Menu Aktif**: Menu mingguan yang sedang berlaku berdasarkan tanggal

## Requirements

### Requirement 1

**User Story:** As an admin, I want to create weekly menu plans with start and end dates, so that I can manage food menus for each week.

#### Acceptance Criteria

1. THE Admin Panel SHALL provide a form to create menu mingguan with nama_menu, tanggal_mulai, and tanggal_selesai
2. THE Admin Panel SHALL validate that tanggal_selesai is after tanggal_mulai
3. THE Admin Panel SHALL allow only one menu mingguan to be active at a time
4. THE Admin Panel SHALL display a list of all menu mingguan ordered by tanggal_mulai descending
5. THE Admin Panel SHALL show which menu mingguan is currently active

### Requirement 2

**User Story:** As an admin, I want to input daily menus for each day of the week, so that I can specify what food is served each day.

#### Acceptance Criteria

1. WHEN admin creates or edits menu mingguan, THE Admin Panel SHALL provide input fields for each day (Senin-Jumat)
2. FOR each day, THE Admin Panel SHALL provide input fields for Sarapan, Makan Siang, and Snack
3. FOR each waktu makan, THE Admin Panel SHALL provide input fields for kategori Anak, Bayi, and Staff
4. THE Admin Panel SHALL allow empty/null values for menu items
5. THE Admin Panel SHALL save all menu harian items when menu mingguan is saved

### Requirement 3

**User Story:** As an admin, I want to set a menu mingguan as active, so that it will be used for daily reports.

#### Acceptance Criteria

1. THE Admin Panel SHALL provide a toggle or button to set menu mingguan as active
2. WHEN admin sets a menu mingguan as active, THE System SHALL set all other menu mingguan to inactive
3. THE Admin Panel SHALL display active status clearly on the menu mingguan list
4. THE System SHALL automatically select menu mingguan as active if its date range includes today's date

### Requirement 4

**User Story:** As a guru, I want to select food menu from the active weekly menu when creating daily report, so that I can record what the student ate.

#### Acceptance Criteria

1. WHEN guru creates daily report, THE System SHALL determine the student's kategori based on their kelas
2. THE System SHALL filter menu options by current day of week and waktu makan
3. THE System SHALL display only menu items matching the student's kategori
4. THE System SHALL use the currently active menu mingguan
5. IF no active menu mingguan exists, THE System SHALL allow manual text input for menu

### Requirement 5

**User Story:** As an admin, I want to copy a previous week's menu, so that I can quickly create a new menu with minor modifications.

#### Acceptance Criteria

1. THE Admin Panel SHALL provide a "Copy" button on each menu mingguan in the list
2. WHEN admin clicks copy, THE System SHALL create a new menu mingguan with all menu harian items duplicated
3. THE System SHALL set the new menu's dates to the next week
4. THE System SHALL set the new menu as inactive by default
5. THE Admin Panel SHALL redirect to edit page for the new menu mingguan

### Requirement 6

**User Story:** As an admin, I want to view and edit existing menu mingguan, so that I can make changes to planned menus.

#### Acceptance Criteria

1. THE Admin Panel SHALL provide an edit button for each menu mingguan
2. THE Admin Panel SHALL display all existing menu harian items in the edit form
3. THE Admin Panel SHALL allow updating nama_menu, dates, and all menu harian items
4. THE Admin Panel SHALL validate that no date conflicts exist with other active menus
5. THE Admin Panel SHALL save changes and redirect to menu mingguan list
