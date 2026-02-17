
# This is a script intended to test the indentR extension

library(tidyverse)

a <- 1:10
b <- 1:10

# Current implementation ---------

theme_update(
  # remove the lines in the background
  panel.grid = element_blank(),
  # change the facet style
  strip.background = element_rect(fill="gray30"),
  strip.text = element_text(colour = 'white')
)
  
  data <- tibble(a, b) |>
    # create new variables
    mutate(
      c = a + b
    )


# Intended functionality ----------

theme_update(
  # remove the lines in the background
  panel.grid = element_blank(),
  # change the facet style
  strip.background = element_rect(fill="gray30"),
  strip.text = element_text(colour = 'white')
)
  
data <- tibble(a, b) |>
  # create new variables
  mutate(
    c = a + b
  )
