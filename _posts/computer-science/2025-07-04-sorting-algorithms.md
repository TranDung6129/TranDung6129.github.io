---
title: "Thuật toán sắp xếp: Từ Bubble Sort đến QuickSort"
layout: single-with-left-panel
date: 2025-07-04
categories:
  - computer-science
tags:
  - algorithms
  - sorting
  - complexity
  - programming
header:
  teaser: "/assets/images/placeholder-article.svg"
---

Thuật toán sắp xếp là một trong những chủ đề cơ bản nhất trong khoa học máy tính, thể hiện sự tiến hóa từ những giải pháp đơn giản đến những thuật toán hiệu quả và tinh tế.

## Tầm quan trọng của thuật toán sắp xếp

Sắp xếp là bước đầu tiên trong nhiều thuật toán phức tạp:
- **Tìm kiếm**: Tìm kiếm trên dữ liệu đã sắp xếp nhanh hơn
- **Cơ sở dữ liệu**: Indexing và query optimization
- **Phân tích dữ liệu**: Thống kê và visualization

## Các thuật toán sắp xếp cơ bản

### 1. Bubble Sort - O(n²)
```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
```

**Ưu điểm**: Đơn giản, dễ hiểu, stable
**Nhược điểm**: Hiệu suất kém với dữ liệu lớn

### 2. Selection Sort - O(n²)
```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
```

**Ưu điểm**: Ít swap operations, in-place
**Nhược điểm**: Không stable, O(n²) trong mọi trường hợp

### 3. Insertion Sort - O(n²)
```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
```

**Ưu điểm**: Hiệu quả với dữ liệu nhỏ và gần như đã sắp xếp
**Nhược điểm**: O(n²) trong trường hợp xấu nhất

## Thuật toán sắp xếp hiệu quả

### 1. Merge Sort - O(n log n)
```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

**Ưu điểm**: Stable, O(n log n) trong mọi trường hợp
**Nhược điểm**: Cần O(n) bộ nhớ thêm

### 2. QuickSort - O(n log n) trung bình
```python
def quicksort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        pi = partition(arr, low, high)
        quicksort(arr, low, pi - 1)
        quicksort(arr, pi + 1, high)
    
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

**Ưu điểm**: In-place, nhanh trong thực tế
**Nhược điểm**: O(n²) trong trường hợp xấu nhất, không stable

## So sánh hiệu suất

| Thuật toán | Best Case | Average Case | Worst Case | Space | Stable |
|------------|-----------|--------------|------------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| QuickSort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |

## Khi nào sử dụng thuật toán nào?

- **Dữ liệu nhỏ (<50)**: Insertion Sort
- **Cần stable**: Merge Sort
- **Cần in-place và nhanh**: QuickSort
- **Giảng dạy**: Bubble Sort (chỉ để minh họa)

## Kết luận

Thuật toán sắp xếp thể hiện sự cân bằng giữa độ phức tạp thời gian, không gian và tính ổn định. Việc lựa chọn thuật toán phù hợp phụ thuộc vào đặc điểm cụ thể của dữ liệu và yêu cầu của ứng dụng.

---

*"Premature optimization is the root of all evil."* - Donald Knuth
