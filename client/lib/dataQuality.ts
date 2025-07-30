// Data Quality & Integrity System for Atlas Sanctum

import { z } from 'zod';

// Data validation schemas
const DataSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['financial', 'environmental', 'social', 'blockchain', 'user']),
  endpoint: z.string().url(),
  lastUpdated: z.date(),
  reliability: z.number().min(0).max(100),
  status: z.enum(['active', 'inactive', 'error', 'maintenance']),
});

const DataQualityMetricsSchema = z.object({
  completeness: z.number().min(0).max(100), // % of non-null values
  accuracy: z.number().min(0).max(100), // % of correct values
  consistency: z.number().min(0).max(100), // % consistent across sources
  timeliness: z.number().min(0).max(100), // % of data within freshness window
  validity: z.number().min(0).max(100), // % of values meeting format/range rules
  uniqueness: z.number().min(0).max(100), // % of non-duplicate records
});

const AuditLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  userId: z.string().optional(),
  action: z.enum(['create', 'read', 'update', 'delete', 'import', 'export', 'transform']),
  entityType: z.string(),
  entityId: z.string(),
  changes: z.record(z.any()).optional(),
  metadata: z.object({
    source: z.string(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    sessionId: z.string().optional(),
  }),
  checksum: z.string(), // Data integrity verification
});

type DataSource = z.infer<typeof DataSourceSchema>;
type DataQualityMetrics = z.infer<typeof DataQualityMetricsSchema>;
type AuditLogEntry = z.infer<typeof AuditLogEntrySchema>;

// Data validation rules
interface ValidationRule {
  id: string;
  field: string;
  type: 'required' | 'range' | 'format' | 'custom';
  params: any;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface DataQualityIssue {
  id: string;
  ruleId: string;
  field: string;
  value: any;
  message: string;
  severity: 'error' | 'warning' | 'info';
  timestamp: Date;
  resolved: boolean;
}

export class DataQualityManager {
  private sources = new Map<string, DataSource>();
  private validationRules = new Map<string, ValidationRule[]>();
  private qualityMetrics = new Map<string, DataQualityMetrics>();
  private issues: DataQualityIssue[] = [];
  private auditLog: AuditLogEntry[] = [];

  constructor() {
    this.initializeValidationRules();
  }

  private initializeValidationRules(): void {
    // Financial data validation rules
    const financialRules: ValidationRule[] = [
      {
        id: 'fin-001',
        field: 'amount',
        type: 'required',
        params: {},
        message: 'Transaction amount is required',
        severity: 'error',
      },
      {
        id: 'fin-002',
        field: 'amount',
        type: 'range',
        params: { min: 0, max: 1000000000 },
        message: 'Transaction amount must be between 0 and 1B',
        severity: 'error',
      },
      {
        id: 'fin-003',
        field: 'currency',
        type: 'format',
        params: { pattern: /^[A-Z]{3}$/ },
        message: 'Currency must be 3-letter ISO code',
        severity: 'error',
      },
      {
        id: 'fin-004',
        field: 'timestamp',
        type: 'custom',
        params: { validator: (value: Date) => value <= new Date() },
        message: 'Transaction timestamp cannot be in the future',
        severity: 'warning',
      },
    ];

    // Environmental data validation rules
    const environmentalRules: ValidationRule[] = [
      {
        id: 'env-001',
        field: 'co2Emissions',
        type: 'range',
        params: { min: 0, max: 100000 },
        message: 'CO2 emissions must be non-negative and reasonable',
        severity: 'error',
      },
      {
        id: 'env-002',
        field: 'location',
        type: 'required',
        params: {},
        message: 'Location coordinates are required',
        severity: 'error',
      },
      {
        id: 'env-003',
        field: 'measurementDate',
        type: 'custom',
        params: { validator: (value: Date) => (new Date().getTime() - value.getTime()) <= 7 * 24 * 60 * 60 * 1000 },
        message: 'Environmental data should be no older than 7 days',
        severity: 'warning',
      },
    ];

    // User data validation rules
    const userRules: ValidationRule[] = [
      {
        id: 'user-001',
        field: 'email',
        type: 'format',
        params: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        message: 'Invalid email format',
        severity: 'error',
      },
      {
        id: 'user-002',
        field: 'age',
        type: 'range',
        params: { min: 13, max: 120 },
        message: 'Age must be between 13 and 120',
        severity: 'error',
      },
      {
        id: 'user-003',
        field: 'gdprConsent',
        type: 'required',
        params: {},
        message: 'GDPR consent is required',
        severity: 'error',
      },
    ];

    this.validationRules.set('financial', financialRules);
    this.validationRules.set('environmental', environmentalRules);
    this.validationRules.set('user', userRules);
  }

  // Register data source
  registerDataSource(source: Omit<DataSource, 'id'>): string {
    const id = crypto.randomUUID();
    const dataSource: DataSource = { ...source, id };
    
    DataSourceSchema.parse(dataSource);
    this.sources.set(id, dataSource);
    
    this.auditLog.push({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      action: 'create',
      entityType: 'DataSource',
      entityId: id,
      metadata: {
        source: 'DataQualityManager',
      },
      checksum: this.calculateChecksum(dataSource),
    });

    return id;
  }

  // Validate data against rules
  validateData(data: any, sourceType: string): DataQualityIssue[] {
    const rules = this.validationRules.get(sourceType) || [];
    const issues: DataQualityIssue[] = [];

    for (const rule of rules) {
      const value = data[rule.field];
      let isValid = true;
      let message = rule.message;

      switch (rule.type) {
        case 'required':
          isValid = value !== undefined && value !== null && value !== '';
          break;

        case 'range':
          if (typeof value === 'number') {
            isValid = value >= rule.params.min && value <= rule.params.max;
          }
          break;

        case 'format':
          if (typeof value === 'string' && rule.params.pattern) {
            isValid = rule.params.pattern.test(value);
          }
          break;

        case 'custom':
          if (rule.params.validator) {
            isValid = rule.params.validator(value);
          }
          break;
      }

      if (!isValid) {
        issues.push({
          id: crypto.randomUUID(),
          ruleId: rule.id,
          field: rule.field,
          value,
          message,
          severity: rule.severity,
          timestamp: new Date(),
          resolved: false,
        });
      }
    }

    return issues;
  }

  // Calculate data quality metrics
  calculateQualityMetrics(dataset: any[], sourceType: string): DataQualityMetrics {
    if (dataset.length === 0) {
      return {
        completeness: 0,
        accuracy: 0,
        consistency: 0,
        timeliness: 0,
        validity: 0,
        uniqueness: 0,
      };
    }

    const totalRecords = dataset.length;
    let completeRecords = 0;
    let validRecords = 0;
    let timeliness = 0;
    let uniqueRecords = 0;

    // Calculate completeness
    const fieldNames = Object.keys(dataset[0] || {});
    dataset.forEach(record => {
      const nonNullFields = fieldNames.filter(field => 
        record[field] !== null && record[field] !== undefined && record[field] !== ''
      );
      completeRecords += nonNullFields.length / fieldNames.length;
    });

    // Calculate validity
    dataset.forEach(record => {
      const issues = this.validateData(record, sourceType);
      const errorCount = issues.filter(issue => issue.severity === 'error').length;
      validRecords += errorCount === 0 ? 1 : 0;
    });

    // Calculate timeliness (assuming records have timestamp field)
    const now = new Date().getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    dataset.forEach(record => {
      if (record.timestamp) {
        const recordTime = new Date(record.timestamp).getTime();
        const age = now - recordTime;
        timeliness += age <= oneDayMs ? 1 : 0; // Consider fresh if less than 1 day old
      }
    });

    // Calculate uniqueness (simplified - based on JSON serialization)
    const serializedRecords = dataset.map(record => JSON.stringify(record));
    const uniqueSet = new Set(serializedRecords);
    uniqueRecords = uniqueSet.size;

    const metrics: DataQualityMetrics = {
      completeness: (completeRecords / totalRecords) * 100,
      accuracy: 95, // Would need external validation source
      consistency: 90, // Would need cross-source comparison
      timeliness: (timeliness / totalRecords) * 100,
      validity: (validRecords / totalRecords) * 100,
      uniqueness: (uniqueRecords / totalRecords) * 100,
    };

    return DataQualityMetricsSchema.parse(metrics);
  }

  // Data profiling
  profileData(dataset: any[]): {
    recordCount: number;
    fieldStats: Record<string, {
      type: string;
      nullCount: number;
      uniqueCount: number;
      min?: number;
      max?: number;
      avg?: number;
      pattern?: string;
    }>;
  } {
    if (dataset.length === 0) {
      return { recordCount: 0, fieldStats: {} };
    }

    const recordCount = dataset.length;
    const fieldStats: Record<string, any> = {};
    const fieldNames = Object.keys(dataset[0] || {});

    fieldNames.forEach(fieldName => {
      const values = dataset.map(record => record[fieldName]).filter(val => val !== null && val !== undefined);
      const nullCount = recordCount - values.length;
      const uniqueValues = new Set(values);
      
      let stats: any = {
        type: typeof values[0],
        nullCount,
        uniqueCount: uniqueValues.size,
      };

      if (typeof values[0] === 'number') {
        const numericValues = values.filter(val => typeof val === 'number');
        if (numericValues.length > 0) {
          stats.min = Math.min(...numericValues);
          stats.max = Math.max(...numericValues);
          stats.avg = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
        }
      }

      if (typeof values[0] === 'string') {
        // Detect common patterns
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\+?[\d\s-()]{10,}$/;
        const datePattern = /^\d{4}-\d{2}-\d{2}/;
        
        if (values.every(val => emailPattern.test(val))) {
          stats.pattern = 'email';
        } else if (values.every(val => phonePattern.test(val))) {
          stats.pattern = 'phone';
        } else if (values.every(val => datePattern.test(val))) {
          stats.pattern = 'date';
        }
      }

      fieldStats[fieldName] = stats;
    });

    return { recordCount, fieldStats };
  }

  // Audit logging
  logDataAccess(action: AuditLogEntry['action'], entityType: string, entityId: string, changes?: any, userId?: string): void {
    const logEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userId,
      action,
      entityType,
      entityId,
      changes,
      metadata: {
        source: 'DataQualityManager',
        sessionId: this.getSessionId(),
      },
      checksum: this.calculateChecksum({ action, entityType, entityId, changes }),
    };

    AuditLogEntrySchema.parse(logEntry);
    this.auditLog.push(logEntry);
    
    // Keep only last 10000 entries
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-10000);
    }
  }

  // Data lineage tracking
  trackDataLineage(dataId: string, transformations: Array<{
    operation: string;
    timestamp: Date;
    sourceFields: string[];
    outputFields: string[];
    rules: string[];
  }>): void {
    transformations.forEach(transformation => {
      this.logDataAccess('transform', 'DataLineage', dataId, transformation);
    });
  }

  // Generate data quality report
  generateQualityReport(sourceId?: string): {
    summary: {
      totalSources: number;
      healthySources: number;
      averageQuality: number;
      criticalIssues: number;
    };
    sources: Array<{
      id: string;
      name: string;
      quality: DataQualityMetrics;
      issues: DataQualityIssue[];
      lastUpdated: Date;
    }>;
    recommendations: string[];
  } {
    const sources = sourceId 
      ? [this.sources.get(sourceId)].filter(Boolean) 
      : Array.from(this.sources.values());

    const sourceDetails = sources.map(source => {
      const quality = this.qualityMetrics.get(source!.id) || {
        completeness: 0, accuracy: 0, consistency: 0, 
        timeliness: 0, validity: 0, uniqueness: 0
      };
      
      const sourceIssues = this.issues.filter(issue => 
        issue.ruleId.startsWith(source!.type.substring(0, 3))
      );

      return {
        id: source!.id,
        name: source!.name,
        quality,
        issues: sourceIssues,
        lastUpdated: source!.lastUpdated,
      };
    });

    const healthySources = sourceDetails.filter(source => 
      Object.values(source.quality).every(metric => metric >= 90)
    ).length;

    const averageQuality = sourceDetails.reduce((sum, source) => {
      const avgQuality = Object.values(source.quality).reduce((a, b) => a + b, 0) / 6;
      return sum + avgQuality;
    }, 0) / sourceDetails.length || 0;

    const criticalIssues = this.issues.filter(issue => 
      issue.severity === 'error' && !issue.resolved
    ).length;

    const recommendations = this.generateRecommendations(sourceDetails);

    return {
      summary: {
        totalSources: sources.length,
        healthySources,
        averageQuality,
        criticalIssues,
      },
      sources: sourceDetails,
      recommendations,
    };
  }

  private generateRecommendations(sources: any[]): string[] {
    const recommendations: string[] = [];

    // Check for low completeness
    const lowCompletenessSources = sources.filter(s => s.quality.completeness < 80);
    if (lowCompletenessSources.length > 0) {
      recommendations.push(`Improve data completeness for ${lowCompletenessSources.length} sources`);
    }

    // Check for timeliness issues
    const staleDataSources = sources.filter(s => s.quality.timeliness < 70);
    if (staleDataSources.length > 0) {
      recommendations.push(`Update data refresh frequency for ${staleDataSources.length} sources`);
    }

    // Check for validation issues
    const invalidDataSources = sources.filter(s => s.quality.validity < 90);
    if (invalidDataSources.length > 0) {
      recommendations.push(`Review validation rules for ${invalidDataSources.length} sources`);
    }

    // Check for duplicate data
    const duplicateDataSources = sources.filter(s => s.quality.uniqueness < 95);
    if (duplicateDataSources.length > 0) {
      recommendations.push(`Implement deduplication for ${duplicateDataSources.length} sources`);
    }

    return recommendations;
  }

  private calculateChecksum(data: any): string {
    // Simple checksum implementation - in production use proper cryptographic hash
    const jsonString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private getSessionId(): string {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('atlas-session-id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('atlas-session-id', sessionId);
    }
    return sessionId;
  }

  // Getters
  getDataSources(): DataSource[] {
    return Array.from(this.sources.values());
  }

  getQualityMetrics(sourceId: string): DataQualityMetrics | undefined {
    return this.qualityMetrics.get(sourceId);
  }

  getDataQualityIssues(resolved = false): DataQualityIssue[] {
    return this.issues.filter(issue => issue.resolved === resolved);
  }

  getAuditLog(entityType?: string, limit = 100): AuditLogEntry[] {
    const filtered = entityType 
      ? this.auditLog.filter(entry => entry.entityType === entityType)
      : this.auditLog;
    
    return filtered.slice(-limit);
  }

  // Issue management
  resolveIssue(issueId: string): void {
    const issue = this.issues.find(i => i.id === issueId);
    if (issue) {
      issue.resolved = true;
      this.logDataAccess('update', 'DataQualityIssue', issueId, { resolved: true });
    }
  }

  // Batch processing
  async processBatch(data: any[], sourceType: string, batchSize = 1000): Promise<{
    processed: number;
    errors: number;
    qualityMetrics: DataQualityMetrics;
  }> {
    let processed = 0;
    let errors = 0;
    const allIssues: DataQualityIssue[] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      try {
        batch.forEach(record => {
          const issues = this.validateData(record, sourceType);
          allIssues.push(...issues);
          
          if (issues.some(issue => issue.severity === 'error')) {
            errors++;
          } else {
            processed++;
          }
        });
      } catch (error) {
        errors += batch.length;
      }
    }

    // Add issues to global list
    this.issues.push(...allIssues);

    // Calculate quality metrics for the batch
    const qualityMetrics = this.calculateQualityMetrics(data, sourceType);

    this.logDataAccess('import', 'DataBatch', crypto.randomUUID(), {
      recordCount: data.length,
      processed,
      errors,
      qualityScore: Object.values(qualityMetrics).reduce((a, b) => a + b, 0) / 6,
    });

    return { processed, errors, qualityMetrics };
  }
}

// Global instance
export const dataQualityManager = new DataQualityManager();

// Export types and schemas
export type { DataSource, DataQualityMetrics, AuditLogEntry, ValidationRule, DataQualityIssue };
export { DataSourceSchema, DataQualityMetricsSchema, AuditLogEntrySchema };
