import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, combineLatest, concatMap, filter, from, map, of, toArray } from 'rxjs';
import { CustomerProduct } from 'src/app/interfaces';
import { JobService, JobUnwindedPartial } from 'src/app/jobs';
import { ProductsService } from 'src/app/services/products.service';
import { JobData, JobWithUpdate } from './interfaces';


export const resolveJobData: ResolveFn<JobData[]> = (route) => {

    const customer = route.queryParamMap.get('customer');
    let products: Observable<CustomerProduct[]> = of([]);
    if (customer) {
        products = inject(ProductsService).productsCustomer(customer).pipe(
            map(prods => prods.filter(prod => prod.price !== undefined)),
        );
    }

    const jobs = inject(JobService).getJobListUnwinded({
        invoice: 0,
        customer,
    });

    return combineLatest({ products, jobs }).pipe(
        concatMap(({ products, jobs }) => from(jobs).pipe(
            filter(job => !!job.products),
            map(job => addProductPrice(job, products)),
            map(job => addColumnData(job)),
        )),
        toArray(),
    );

};


function addProductPrice(job: JobUnwindedPartial, cProducts: CustomerProduct[]): JobWithUpdate {

    const product = job.products;
    if (cProducts.length === 0 && !product?.price) {
        return job;
    } else {
        return product && !product.price ? {
            ...job,
            'products.priceUpdate': cProducts.find(cp => cp.productName === product.name)?.price,
        } : job;
    }

}

function addColumnData(job: JobWithUpdate): JobData {
    const product = job.products;
    return {
        ...job,
        'products.name': product?.name || '',
        'products.price': product?.price || 0,
        'products.count': product?.count || 0,
        'products.total': (job['products.priceUpdate'] !== undefined ? job['products.priceUpdate'] : product?.price) * product?.count,
        'products.units': product?.units || '',
    };
}
