import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { steps } from "./steps";
import React from "react";
import { Button } from "@/components/ui/button";

interface BreadcrumbProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export default function Breadcrumbs({
  currentStep,
  setCurrentStep,
}: BreadcrumbProps) {
  return (
    <div className="flex items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          {steps.map((step) => (
            <React.Fragment key={step.key}>
              <BreadcrumbItem>
                {step.key === currentStep ? (
                  <BreadcrumbPage>{step.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Button onClick={() => setCurrentStep(step.key)}>
                        {step.title}
                      </Button>
                    }
                  ></BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="last:hidden" />
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
