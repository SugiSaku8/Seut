# js/node/utils.py
size = None

def init(a, type):
    global size
    if type == "memory":
        init_ram(a)
    elif type == "storage":
        init_storage(a)
    else:
        print(f"Sort System Error:\nAn error occurred while sorting {type}.\n{type} cannot be initialized with SORT.")

def init_ram(a):
    global size
    size = a['size']
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    numbers = [str(i) for i in range(100000000)]
    counter = 0
    for char in alphabet:
        if counter >= size:
            break
        a[f'a.{char}'] = None
        counter += 1
    for num in numbers:
        for char in alphabet:
            if counter >= size:
                break
            a[f'a.{char}{num}'] = None
            counter += 1
        if counter >= size:
            break
    return a

def init_storage(a):
    global size
    size = a['size']
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    numbers = [str(i) for i in range(256)]
    counter = 0
    for char in alphabet:
        if counter >= size:
            break
        a[f'a.{char}'] = None
        counter += 1
    for num in numbers:
        for char in alphabet:
            if counter >= size:
                break
            a[f'a.{char}{num}'] = None
            counter += 1
        if counter >= size:
            break
    return a

def get_blank(obj):
    return next((key for key in obj if obj[key] is None), None)

def get_ntn_blank(obj):
    keys = list(obj.keys())
    first_empty = get_blank(obj)
    index = keys.index(first_empty) if first_empty in keys else -1
    return keys[index + 1] if index != -1 and index + 1 < len(keys) else None