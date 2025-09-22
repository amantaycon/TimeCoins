package com.timecoins.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.timecoins.model.CoinsValueHistory;

public interface CoinsValueHistoryRepository extends JpaRepository<CoinsValueHistory, Long> {

    // Get the latest coin value
    CoinsValueHistory findTopByOrderByIdDesc();

    // Daily aggregation
    @Query(value = """
        SELECT DATE(cvh.date_time) AS period,
               AVG(cvh.value_in_rupees) AS avg_value,
               MIN(cvh.value_in_rupees) AS min_value,
               MAX(cvh.value_in_rupees) AS max_value
        FROM coins_value_history cvh
        WHERE cvh.date_time >= :startDate
        GROUP BY DATE(cvh.date_time)
        ORDER BY period ASC
        """, nativeQuery = true)
    List<Object[]> aggregateDaily(@Param("startDate") LocalDateTime startDate);

    // Weekly aggregation (fixed for ONLY_FULL_GROUP_BY and Java casting)
    @Query(value = """
        SELECT MIN(STR_TO_DATE(CONCAT(YEARWEEK(cvh.date_time, 3), ' Monday'), '%X%V %W')) AS period_start,
               AVG(cvh.value_in_rupees) AS avg_value,
               MIN(cvh.value_in_rupees) AS min_value,
               MAX(cvh.value_in_rupees) AS max_value
        FROM coins_value_history cvh
        WHERE cvh.date_time >= :startDate
        GROUP BY YEARWEEK(cvh.date_time, 3)
        ORDER BY period_start ASC
        """, nativeQuery = true)
    List<Object[]> aggregateWeekly(@Param("startDate") LocalDateTime startDate);

    // Monthly aggregation (fixed)
    @Query(value = """
        SELECT DATE_FORMAT(cvh.date_time, '%Y-%m-01') AS period_start,
               AVG(cvh.value_in_rupees) AS avg_value,
               MIN(cvh.value_in_rupees) AS min_value,
               MAX(cvh.value_in_rupees) AS max_value
        FROM coins_value_history cvh
        WHERE cvh.date_time >= :startDate
        GROUP BY YEAR(cvh.date_time), MONTH(cvh.date_time)
        ORDER BY period_start ASC
        """, nativeQuery = true)
    List<Object[]> aggregateMonthly(@Param("startDate") LocalDateTime startDate);

 // All-time detailed rows (limited to 500)
    @Query(value = """
            SELECT MIN(STR_TO_DATE(CONCAT(YEARWEEK(cvh.date_time, 3), ' Monday'), '%X%V %W')) AS period_start,
                   AVG(cvh.value_in_rupees) AS avg_value,
                   MIN(cvh.value_in_rupees) AS min_value,
                   MAX(cvh.value_in_rupees) AS max_value
            FROM coins_value_history cvh
            GROUP BY YEARWEEK(cvh.date_time, 3)
            ORDER BY period_start ASC
            LIMIT 500
            """, nativeQuery = true)
    List<Object[]> findAllDetailedLimited();

}
