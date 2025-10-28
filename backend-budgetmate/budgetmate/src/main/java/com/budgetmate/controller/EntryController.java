package com.budgetmate.controller;
import com.budgetmate.dto.EntryDTO;
import com.budgetmate.model.Entry;
import com.budgetmate.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/entries")
@RequiredArgsConstructor
public class EntryController {

    private final EntryService entryService;

    @PostMapping
    public Entry addEntry(@RequestBody Entry entry, @RequestParam Long userId) {
        return entryService.saveEntry(entry, userId);
    }
    @GetMapping
    public List<EntryDTO> getEntries(@RequestParam Long userId) {
        return entryService.getEntriesByUserId(userId);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        entryService.deleteEntryById(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<EntryDTO> updateEntry(@PathVariable Long id, @RequestBody EntryDTO updatedEntry) {
        EntryDTO entry = entryService.updateEntry(id, updatedEntry);
        return ResponseEntity.ok(entry);
    }}
