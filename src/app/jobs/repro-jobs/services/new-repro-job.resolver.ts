import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Job } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { parseJobId } from './parse-job-id';
import { JobTemplate, ReproJobService } from './repro-job.service';
import { UploadRefService } from './upload-ref.service';

const defaultReproJob: (template?: Partial<Job>) => JobTemplate = (template) => ({
  name: template?.name ?? '',
  customer: template?.customer,
  receivedDate: new Date(),
  dueDate: new Date(),
  production: template?.production ?? {
    category: 'repro' as const,
  },
  comment: template ? `[${template.jobId}] ${template.comment ?? ''}` : undefined,
  customerJobId: template?.customerJobId,
  jobStatus: {
    generalStatus: 20,
    timestamp: new Date(),
  },
  products: template?.products ?? [],
  files: undefined,
  productionStages: [],
});

export const newReproJob: ResolveFn<JobTemplate> = async (route) => {
  const oldJobId = parseJobId(route.queryParams.copyId);

  if (typeof oldJobId === 'number') {
    const uploadRefService = inject(UploadRefService);

    const oldJob = await inject(JobService).getJob(oldJobId);
    if (route.queryParams.copyFiles === 'true') {
      uploadRefService.setJobFolderCopy(oldJob.jobId, oldJob.files?.fileNames ?? []);
    }
    return defaultReproJob(oldJob);
  } else {
    return {
      ...defaultReproJob(),
      ...inject(ReproJobService).retrieveJobTemplate(),
    };
  }
};
