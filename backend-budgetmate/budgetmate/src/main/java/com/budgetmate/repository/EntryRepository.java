package com.budgetmate.repository;

import com.budgetmate.model.Entry;
import com.budgetmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long> {

    // ✅ Fetch entries by full User object
    List<Entry> findByUser(User user);

    // ✅ Optional: fetch directly by user ID (avoid fetching User if not needed)
//    List<Entry> findAllByUserId(Long userId);

    List<Entry> findByUserId(Long userId);
}
