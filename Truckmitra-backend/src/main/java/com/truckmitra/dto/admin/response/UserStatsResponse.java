// src/main/java/com/truckmitra/dto/admin/response/UserStatsResponse.java
package com.truckmitra.dto.admin.response;

public record UserStatsResponse(
    long pending,
    long approved,
    long rejected,
    long suspended,
    long deleted,
    long total
) {
    public static UserStatsResponseBuilder builder() {
        return new UserStatsResponseBuilder();
    }
    
    public static class UserStatsResponseBuilder {
        private long pending;
        private long approved;
        private long rejected;
        private long suspended;
        private long deleted;
        private long total;
        
        public UserStatsResponseBuilder pending(long pending) {
            this.pending = pending;
            return this;
        }
        
        public UserStatsResponseBuilder approved(long approved) {
            this.approved = approved;
            return this;
        }
        
        public UserStatsResponseBuilder rejected(long rejected) {
            this.rejected = rejected;
            return this;
        }
        
        public UserStatsResponseBuilder suspended(long suspended) {
            this.suspended = suspended;
            return this;
        }
        
        public UserStatsResponseBuilder deleted(long deleted) {
            this.deleted = deleted;
            return this;
        }
        
        public UserStatsResponseBuilder total(long total) {
            this.total = total;
            return this;
        }
        
        public UserStatsResponse build() {
            return new UserStatsResponse(pending, approved, rejected, suspended, deleted, total);
        }
    }
}