
def shallow_or_deep(obj, should_copy):
    if should_copy:
        return obj.copy()
    return obj


def clamp(value, min, max):
    if value < min:
        return min
    elif value > max:
        return max
    return value


def get_normal_on_none(obj, normal):
    if obj is None:
        return normal
    return obj


def get_element_or_none(lst, idx):
    if lst is None or len(lst) >= idx:
        return None
    return lst[idx]
