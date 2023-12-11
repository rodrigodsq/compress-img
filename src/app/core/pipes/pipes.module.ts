import { NgModule, Type } from '@angular/core';
import { TextLimitPipe } from './text-limit/text-limit.pipe';

const commonModules: Array<Type<any>> = [
  TextLimitPipe
];

@NgModule({
    imports: commonModules,
    exports: commonModules
})
export class PipesModule
{ }
