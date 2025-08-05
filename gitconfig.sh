#!/bin/bash

# Проверка, передан ли аргумент
if [ -z "$1" ]; then
  echo "Ошибка: не указан комментарий для коммита."
  echo "Использование: ./gitconfig.sh \"commit_message\""
  exit 1
fi

# Сохранение аргумента как комментария
commit_msg="$1"

# Добавить все файлы
git add .

# Сделать коммит
git commit -m "$commit_msg"

# Определить текущую ветку
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Сделать push
git push origin "$current_branch"
