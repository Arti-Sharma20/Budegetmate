package com.budgetmate.service;
import com.budgetmate.dto.EntryDTO;
import com.budgetmate.model.Entry;
import com.budgetmate.repository.EntryRepository;
import com.budgetmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EntryService {

    private final EntryRepository entryRepository;
    private final UserRepository userRepository;

    public Entry saveEntry(Entry entry, Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        entry.setUser(userRepository.getReferenceById(userId));

        // ✅ Set date if not already provided
        if (entry.getDate() == null || entry.getDate().isEmpty()) {
            entry.setDate(LocalDate.now().toString()); // e.g., "2025-06-17"
        }
        return entryRepository.save(entry);
    }

    public List<EntryDTO> getEntriesByUserId(Long userId) {
        return entryRepository.findByUserId(userId).stream()
                .map(EntryDTO::new)
                .toList();
    }

    public void deleteEntryById(Long id) {
        if (!entryRepository.existsById(id)) {
            throw new NoSuchElementException("Entry not found with id " + id);
        }
        entryRepository.deleteById(id);
    }

    public EntryDTO updateEntry(Long id, EntryDTO updatedEntry) {
        Entry entry = entryRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Entry not found with id " + id)
        );
        entry.setCategory(updatedEntry.getCategory());
        entry.setAmount(updatedEntry.getAmount());
        entry.setDescription(updatedEntry.getDescription());
        entry.setType(updatedEntry.getType()); // if you're tracking type

        Entry saved = entryRepository.save(entry);
        return new EntryDTO(saved);
    }}
