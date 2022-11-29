(function () {
  window.__n = window.__n || (function (callback) {
    window.document.addEventListener('readystatechange', function () {
      if (document.readyState === 'complete') {
        callback.apply(this, [])
      }
    })
  })

  function getContainerElementChild(query, carousel) {
    if (!(typeof query === typeof 'str')) {
      return
    }

    const queryAlternates = [
      '[' + query + ']',
      '.' + query,
      '#' + query
    ]

    for (var i = 0; i < queryAlternates.length; i++) {
      const queryAlternate = queryAlternates[i]

      let element = null

      if (element = carousel.querySelector(queryAlternate)) {
        return element
      }
    }
  }

  __n(/* Sliders */ function () {
    const sliderElements = document.querySelectorAll('[data-slider]')

    if (sliderElements.length >= 1) {
      sliderElements.forEach(function (sliderElement) {
        const nextButtonQuery = sliderElement.getAttribute('data-slider-next')
        const prevButtonQuery = sliderElement.getAttribute('data-slider-prev')

        const nextButton = nextButtonQuery ? document.querySelector(nextButtonQuery) : null
        const prevButton = prevButtonQuery ? document.querySelector(prevButtonQuery) : null

        function moveSlide(event, next) {
          const slides = Array.from(sliderElement.childNodes).filter(function (child) {
            return child.nodeName === 'DIV'
          })

          const activeItem = sliderElement.querySelector('.active') ? sliderElement.querySelector('.active') : slides[0]
          const activeItemIndex = slides.indexOf(activeItem)
          const nextIndexValue = activeItemIndex + next

          const nextIndex = nextIndexValue >= slides.length ? 0 : (nextIndexValue <= 0 ? slides.length - 1 : nextIndexValue);

          activeItem.classList.remove('active')

          slides[nextIndex].classList.add('active')
        }

        const buttons = [
          [nextButton, +1],
          [prevButton, -1]
        ]

        buttons.forEach(function (button) {
          if (button[0]) {
            button[0].addEventListener('click', function (event) {
              moveSlide.apply(this, [event, button[1]])
            })
          }
        })
      })
    }
  })

  __n(/* Carousel */ function () {
    const carouselElements = document.querySelectorAll('[data-carousel]')

    function elementMargins(element) {
      const styles = window.getComputedStyle(element)

      return parseFloat(styles.marginLeft) + parseFloat(styles.marginRight)
    }

    if (carouselElements.length >= 1) {

      window.addEventListener('resize', function () {
        carouselElements.forEach(function (carouselElement) {
          const carouselBody = getContainerElementChild('data-carousel-body', carouselElement)

          carouselBody.style.marginLeft = '0px'
        })
      })

      carouselElements.forEach(function (carouselElement) {
        const carouselNextButton = getContainerElementChild('data-carousel-next', carouselElement)
        const carouselPrevButton = getContainerElementChild('data-carousel-prev', carouselElement)
        const carouselBody = getContainerElementChild('data-carousel-body', carouselElement)

        // console.log(carouselPrevButton, carouselNextButton)
        function moveCarousel(next) {
          if (!carouselBody) {
            return
          }

          const carouselBodyChildren = Array.from(carouselBody.childNodes).filter(el => el.nodeName == 'DIV')

          const carouselBodyChildrenWidth = carouselBodyChildren[0].offsetWidth

          const carouselBodyChildrenTotalWidth = carouselBodyChildren
            .map(el => el.offsetWidth)
            .reduce((a, b = 0) => a + b)

          // console.log("carouselBodyChildrenTotalWidth => ", carouselBodyChildrenTotalWidth)

          const CAROUSEL_VELOCITY = carouselBodyChildrenWidth * Math.floor(window.innerWidth / carouselBodyChildrenWidth)

          const carouselBodyMarginLeft = parseFloat(window.getComputedStyle(carouselBody).marginLeft)

          const moveBy = (carouselBodyMarginLeft * (carouselBodyMarginLeft < 0 ? -1 : 1)) + (CAROUSEL_VELOCITY * next)

          const moveByValue = moveBy <= 0 ? 0 : moveBy

          console.log("carouselBodyChildrenTotalWidth => ", carouselBodyChildrenTotalWidth)
          console.log("move by => ", moveByValue + CAROUSEL_VELOCITY)
          console.log('='.repeat(100))
          // if (moveBy <= 0) {
          //   carouselBody.style.marginLeft = '0px'
          // } else {
          // if (moveByValue + CAROUSEL_VELOCITY <= carouselBodyChildrenTotalWidth) {
          //   console.log('CAN!!')
          // }

          if (next < 1) {
            carouselBody.style.marginLeft = '-' + moveByValue + 'px'
          } else {
            const finalMoveByValue = ((moveByValue + CAROUSEL_VELOCITY <= carouselBodyChildrenTotalWidth) ? moveByValue : ((carouselBodyChildrenTotalWidth - CAROUSEL_VELOCITY) + carouselBodyChildrenWidth + elementMargins(carouselBodyChildren[0])))

            carouselBody.style.marginLeft = '-' + (finalMoveByValue > carouselBodyChildrenTotalWidth ? carouselBodyChildrenTotalWidth : finalMoveByValue) + 'px'
          }

          // }
        }

        const buttons = [
          [carouselNextButton, 1],
          [carouselPrevButton, -1]
        ]

        buttons.forEach(function (button) {
          if (button[0]) {
            button[0].addEventListener('click', function (event) {
              event.preventDefault()
              moveCarousel.apply(this, [button[1]])
            })
          }
        })
      })
    }
  })


  __n(/* ToolTip */ function () {
    const menuTooltipElements = document.querySelectorAll('[data-menu-tooltip]')

    if (menuTooltipElements.length >= 0) {
      menuTooltipElements.forEach(function (menuTooltipElement) {
        const body = getContainerElementChild('data-menu-tooltip-body', menuTooltipElement)

        if (body) {
          menuTooltipElement.hideWhenLeave = true

          body.addEventListener('mouseenter', function () {
            menuTooltipElement.hideWhenLeave = false
          })

          body.addEventListener('mouseleave', function () {
            menuTooltipElement.hideWhenLeave = true
          })

          menuTooltipElement.addEventListener('mouseenter', function () {
            body.classList.add('visible')
          })

          menuTooltipElement.addEventListener('mouseleave', function () {
            setTimeout(function () {
              if (menuTooltipElement.hideWhenLeave) {
                body.classList.remove('visible')
              }
            }, 100)
          })
        }
      })
    }
  })

  __n(/* DropDown */ function () {
    const dropDownElements = document.querySelectorAll('[data-dropdown]')

    if (dropDownElements.length >= 0) {
      window.addEventListener('scroll', function () {
        dropDownElements.forEach(function (dropDownElement) {
          const body = getContainerElementChild('data-dropdown-body', dropDownElement)

          body.classList.remove('show')
        })
      })

      dropDownElements.forEach(function (dropDownElement) {
        const body = getContainerElementChild('data-dropdown-body', dropDownElement)
        const button = getContainerElementChild('data-dropdown-button', dropDownElement)

        if (!(button && body)) {
          return;
        }

        button.tabIndex = 1

        button.addEventListener('click', function (event) {
          event.preventDefault()

          body.classList.toggle('show')
        })

        function dropdownHideHandler() {
          setTimeout(function () {
            body.classList.remove('show')
          }, 150)
        }

        button.addEventListener('blur', dropdownHideHandler)
      })
    }
  })
}())
