
# Setup ------------

library(hexSticker)
library(showtext)

# Load the font
font_add_google("Montserrat", "montserrat")
showtext_auto()

# Define your image path
imgurl <- "logo/logo_content.drawio.png"


# Create sticker ----------

sticker(
  subplot = imgurl,       # The image path (or a plot object)
  package = "indentR",    # The text label
  
  # Font Settings
  p_family = "montserrat",  # Matches the name in font_add_google
  p_size = 21,            # Text size
  p_color = "white",      # Text color
  
  # Image Settings
  s_x = 1,                # Horizontal position (1 = center)
  s_y = 0.75,             # Vertical position (adjust to avoid overlap)
  s_width = 0.5,          # Image width
  
  # Hexagon Colors 
  h_fill = "#750014",     # Background fill
  h_color = "#750014",    # Border color
  
  # Output
  filename = "logo/final_logo.png",
  dpi = 300
)

# sticker(
#   subplot = imgurl,       # The image path (or a plot object)
#   package = "indentR",    # The text label
  
#   # Font Settings
#   p_family = "montserrat",  # Matches the name in font_add_google
#   p_size = 21,            # Text size
#   p_color = "white",      # Text color
#   p_x = 1,
#   p_y = 0.5,
  
#   # Image Settings
#   s_x = 1,                # Horizontal position (1 = center)
#   s_y = 1.1,             # Vertical position (adjust to avoid overlap)
#   s_width = 0.5,          # Image width
  
#   # Hexagon Colors 
#   h_fill = "#750014",     # Background fill
#   h_color = "#750014",    # Border color
  
#   # Output
#   filename = "logo/final_logo.png",
#   dpi = 300
# )
