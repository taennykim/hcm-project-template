from fastapi import APIRouter, status

from app.domains.employee.schemas import (
    Employee,
    EmployeeCreate,
    EmployeeListResponse,
    EmployeeStatusUpdate,
    EmployeeUpdate,
)
from app.domains.employee.service import employee_service


router = APIRouter(tags=["employees"])


@router.get("/employees", response_model=EmployeeListResponse)
def list_employees() -> EmployeeListResponse:
    return EmployeeListResponse(items=employee_service.list_employees())


@router.post(
    "/employees",
    response_model=Employee,
    status_code=status.HTTP_201_CREATED,
)
def create_employee(payload: EmployeeCreate) -> Employee:
    return employee_service.create_employee(payload)


@router.get("/employees/{employee_id}", response_model=Employee)
def get_employee(employee_id: str) -> Employee:
    return employee_service.get_employee(employee_id)


@router.patch("/employees/{employee_id}", response_model=Employee)
def update_employee(employee_id: str, payload: EmployeeUpdate) -> Employee:
    return employee_service.update_employee(employee_id, payload)


@router.patch("/employees/{employee_id}/status", response_model=Employee)
def update_employee_status(
    employee_id: str, payload: EmployeeStatusUpdate
) -> Employee:
    return employee_service.update_employee_status(employee_id, payload)
