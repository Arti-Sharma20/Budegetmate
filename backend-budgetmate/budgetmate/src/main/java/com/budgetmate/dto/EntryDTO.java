package com.budgetmate.dto;

import com.budgetmate.model.Entry;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EntryDTO {
    private Long id;
    private String type;
    private double amount;
    private String category;
    private String description;
    private String date;         // ✅ Add this line
    private Long userId;

    public EntryDTO(Entry entry) {
        this.id = entry.getId();
        this.type = entry.getType();
        this.amount = entry.getAmount();
        this.category = entry.getCategory();
        this.description = entry.getDescription();
        this.date = entry.getDate(); // ✅ Assign date here

        if (entry.getUser() != null) {
            this.userId = entry.getUser().getId();
        }
    }
}
